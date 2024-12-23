import { Injectable } from '@nestjs/common';
import { VerificationResponse } from './dto/verificationResponse.dto';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UserService } from '../user/user.service';
import { InjectModel, Model } from 'nestjs-dynamoose';
import {
  Verification,
  VerificationKey,
} from './interfaces/verification.interface';
import { v4 as uuidv4 } from 'uuid';
import { Vote, VoteKey } from './interfaces/vote.interface';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(`${process.env.STAGE}-skkulife`)
    private readonly verificationModel: Model<Verification, VerificationKey>,

    @InjectModel(`${process.env.STAGE}-skkulife`)
    private readonly voteModel: Model<Vote, VoteKey>,

    private readonly userService: UserService,
  ) {}

  async getVerificationsByDate(
    classId: string,
    date: string,
  ): Promise<VerificationResponse> {
    const verificationItems = await this.verificationModel
      .query('SK')
      .eq(`class#${classId}#verification#${date}`)
      .all()
      .using('inverted-index')
      .exec();

    for (let i = 0; i < verificationItems.length; i++) {
      delete verificationItems[i].PK;
      delete verificationItems[i].SK;
    }

    return {
      verifications: verificationItems,
    };
  }

  async getVerificationById(verificationId: string): Promise<Verification[]> {
    const verifications = await this.verificationModel
      .query('verificationId')
      .eq(verificationId)
      .using('verificationId-index')
      .exec();

    return verifications.filter((item) => item.verificationImage);
  }

  async vote(
    email: string,
    classId: string,
    verificationId: string,
    vote: any,
  ): Promise<VerificationResponse> {
    const votes = await this.getVoteByVerificationId(
      classId,
      verificationId,
      email,
    );

    if (votes.length == 0) {
      const voteItem = {
        PK: email,
        SK: `class#${classId}#vote#${verificationId}`,
        verificationId,
        vote,
      };

      await this.voteModel.create(voteItem);

      const verificationItem = (
        await this.getVerificationById(verificationId)
      )[0];

      const updatedVerification = await this.updateVerification(
        verificationItem.PK,
        verificationItem.SK,
        vote,
      );

      delete updatedVerification.PK;
      delete updatedVerification.SK;

      return {
        verifications: [updatedVerification],
      };
    }

    return {
      verifications: [],
    };
  }

  async updateVerification(
    PK: string,
    SK: string,
    vote: boolean,
  ): Promise<Verification> {
    if (vote) {
      return this.verificationModel.update(
        { PK, SK },
        { $ADD: { yesVote: 1 } },
        { returnValues: 'ALL_NEW', return: 'item' },
      );
    } else {
      return this.verificationModel.update(
        { PK, SK },
        { $ADD: { noVote: 1 } },
        { returnValues: 'ALL_NEW', return: 'item' },
      );
    }
  }

  async getVoteByVerificationId(
    classId: string,
    verificationId: string,
    email: string,
  ): Promise<Vote[]> {
    return this.voteModel
      .query('PK')
      .eq(email)
      .filter('SK')
      .eq(`class#${classId}#vote#${verificationId}`)
      .exec();
  }

  async upload(
    email: string,
    classId: string,
    verification: Express.Multer.File,
  ): Promise<VerificationResponse> {
    const verificationId = uuidv4();

    const userInfo = (await this.userService.getUserInfo(email))[0];

    const date = new Date().toISOString().split('T')[0];

    const awsRegion = 'ap-northeast-2';

    const bucketName = 'skkulife.verification';

    const client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
    });

    const id = email.split('@')[0];
    const extSplit = verification.originalname.split('.');
    const ext = extSplit[extSplit.length - 1];

    const key = `${date}_${id}.${ext}`;

    const params = {
      Key: key,
      Body: verification.buffer,
      Bucket: bucketName,
      ContentType: verification.mimetype,
      ContentEncoding: 'base64',
      ACL: ObjectCannedACL.public_read,
    };

    const command = new PutObjectCommand(params);

    await client.send(command);

    const fileUrl = `https://s3.ap-northeast-2.amazonaws.com/skkulife.verification/${key}`;

    const verificationItem: any = {
      PK: email,
      SK: `class#${classId}#verification#${date}`,
      userName: userInfo.name,
      verificationId,
      verificationImage: fileUrl,
      verificationDate: date,
      verificationStatus: 0,
      yesVote: 0,
      noVote: 0,
    };

    await this.verificationModel.create(verificationItem);

    delete verificationItem.PK;
    delete verificationItem.SK;

    verificationItem.userName = userInfo.name;

    return {
      verifications: [verificationItem],
    };
  }
}
