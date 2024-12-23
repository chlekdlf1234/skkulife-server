import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SigninResponse } from './dto/signinResponse.dto';
import DeleteKeyHelper from '../helper/deleteKey.helper';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { EmailCode, EmailCodeKey } from './interfaces/emailCode.interface';
import { MailService } from '../mail/mail.service';
import { SignupResponse } from './dto/signupResponse.dto';
import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(`${process.env.STAGE}-skkulife`)
    private readonly emailCodeModel: Model<EmailCode, EmailCodeKey>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, pwd: string): Promise<boolean> {
    const userData = (await this.userService.getUserInfo(email))[0];

    if (pwd == userData.pwd) {
      return true;
    } else {
      return false;
    }
  }

  async signIn(email: string): Promise<SigninResponse> {
    const payload = { sub: email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async signUp(
    profile: Express.Multer.File,
    email: string,
    pwd: string,
    name: string,
    studentId: string,
  ): Promise<SignupResponse> {
    const userData = (await this.userService.getUserInfo(email))[0];

    if (userData) {
      throw new Error('Already Registered');
    }

    const awsRegion = 'ap-northeast-2';

    const bucketName = 'skkulife';

    const client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
    });

    const id = email.split('@')[0];
    const extSplit = profile.originalname.split('.');
    const ext = extSplit[extSplit.length - 1];

    const key = `${Date.now().toString()}_${id}.${ext}`;

    const params = {
      Key: key,
      Body: profile.buffer,
      Bucket: bucketName,
      ContentType: profile.mimetype,
      ContentEncoding: 'base64',
      ACL: ObjectCannedACL.public_read,
    };

    const command = new PutObjectCommand(params);

    await client.send(command);

    const fileUrl = `https://skkulife.s3.ap-northeast-2.amazonaws.com/${key}`;

    const user = await this.userService.createUserInfo(
      email,
      pwd,
      fileUrl,
      name,
      studentId,
    );

    const code = (await this.createEmailCode(email)).code;

    await this.mailService.sendCodeMail(email, code);

    delete user.pwd;

    const payload = { sub: email };
    const token = this.jwtService.sign(payload);

    return {
      userInfo: DeleteKeyHelper.deleteKey(user),
      token,
    };
  }

  async createEmailCode(email: string): Promise<EmailCode> {
    const size = 6;

    const max = Math.pow(10, size);

    const randomNumber = crypto.randomInt(0, max);

    const code = randomNumber.toString().padStart(size, '0');

    const codeData = {
      PK: email,
      SK: 'email#code',
      code,
    };

    return this.emailCodeModel.create(codeData);
  }

  async getEmailCode(email: string): Promise<EmailCode[]> {
    return this.emailCodeModel
      .query('PK')
      .eq(email)
      .filter('SK')
      .eq(`email#code`)
      .exec();
  }

  async verifyEmailCode(email: string, code: string): Promise<void> {
    const userCodeItem = (await this.getEmailCode(email))[0];

    if (userCodeItem.code != code) {
      throw new Error('Wrong Code');
    }

    await this.userService.updateUserVerification(email);

    return;
  }
}
