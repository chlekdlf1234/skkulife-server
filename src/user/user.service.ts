import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UserInfo, UserInfoKey } from './interfaces/userInfo.interface';
import { UserInfoResponse } from './dto/userInfoResponse.dto';
import { ClassService } from '../class/class.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(`${process.env.STAGE ? process.env.STAGE : 'dev'}-skkulife`)
    private readonly userModel: Model<UserInfo, UserInfoKey>,

    @Inject(forwardRef(() => ClassService))
    private readonly classService: ClassService,
  ) {}

  async getUserInfo(email: string): Promise<UserInfo[]> {
    return this.userModel
      .query('PK')
      .eq(email)
      .filter('SK')
      .eq(`user#info`)
      .exec();
  }
  async getAllUser(): Promise<UserInfo[]> {
    return this.userModel
      .query('SK')
      .eq('user#info')
      .using('inverted-index')
      .exec();
  }

  async getUserMyPageInfo(email: string): Promise<UserInfoResponse> {
    const userInfoItem = (await this.getUserInfo(email))[0];

    const userClasses = await this.classService.getUserClasses(email);

    const myPageInfo = {
      userName: userInfoItem.name,
      userImage: userInfoItem.profile,
      email,
      userClass: userClasses,
    };

    return myPageInfo;
  }

  async createUserInfo(
    email: string,
    pwd: string,
    profile: string,
    name: string,
    studentId: string,
  ): Promise<UserInfo> {
    const userData = {
      PK: email,
      SK: 'user#info',
      isVerified: false,
      email,
      pwd,
      role: 'user',
      profile,
      name,
      studentId,
    };

    return this.userModel.create(userData);
  }

  async updateUserVerification(email: string): Promise<UserInfo> {
    return this.userModel.update(
      { PK: email, SK: 'user#info' },
      { $SET: { isVerified: true } },
      { returnValues: 'UPDATED_NEW', return: 'item' },
    );
  }
}
