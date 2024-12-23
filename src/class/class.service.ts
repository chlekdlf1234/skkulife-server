import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateClassRequest } from './dto/createClassRequest.dto';
import { ClassResponse } from './dto/classResponse.dto';
import { StatisticsResponse } from './dto/statisticsResponse.dto';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Class, ClassKey } from './interfaces/class.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { UpdateClassRequest } from './dto/updateClassRequest.dto';
import { UserClass, UserClassKey } from './interfaces/userClass.interface';
import { UserInfo } from '../user/interfaces/userInfo.interface';
import { UserService } from '../user/user.service';
import DeleteKeyHelper from '../helper/deleteKey.helper';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(`${process.env.STAGE}-skkulife`)
    private readonly classModel: Model<Class, ClassKey>,

    @InjectModel(`${process.env.STAGE}-skkulife`)
    private readonly userClassModel: Model<UserClass, UserClassKey>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createClass(
    classImage: Express.Multer.File,
    email: string,
    createClassRequest: CreateClassRequest,
  ): Promise<ClassResponse> {
    const userInfo = (await this.userService.getUserInfo(email))[0];

    const classId = uuidv4();

    const awsRegion = 'ap-northeast-2';

    const bucketName = 'skkulife';

    const client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
    });

    const extSplit = classImage.originalname.split('.');
    const ext = extSplit[extSplit.length - 1];

    const key = `${Date.now().toString()}_${classId}.${ext}`;

    const params = {
      Key: key,
      Body: classImage.buffer,
      Bucket: bucketName,
      ContentType: classImage.mimetype,
      ContentEncoding: 'base64',
      ACL: ObjectCannedACL.public_read,
    };

    const command = new PutObjectCommand(params);

    await client.send(command);

    const classImageUrl = `https://skkulife.s3.ap-northeast-2.amazonaws.com/${key}`;

    const {
      className,
      manager,
      classCode,
      classDescription,
      classDate,
      classStartTime,
      classEndTime,
      voteEnd,
      votePercent,
      penaltyType,
    } = createClassRequest;

    const classData = {
      PK: classId,
      SK: `class#${classId}`,
      classImage: classImageUrl,
      classId,
      className,
      classDescription,
      manager,
      classCode,
      classDate,
      classStartTime,
      classEndTime,
      voteEnd,
      votePercent,
      penaltyType,
    };

    const userClassItem = {
      PK: email,
      SK: `class#${classId}`,
      classId,
    };

    await this.userClassModel.create(userClassItem);

    const classItem = DeleteKeyHelper.deleteKey(
      await this.classModel.create(classData),
    );

    return {
      ...classItem,
      classMember: [
        {
          userName: userInfo.name,
          userImage: userInfo.profile,
        },
      ],
    };
  }

  async updateClass(
    classImage: Express.Multer.File,
    updateClassRequest: UpdateClassRequest,
  ): Promise<ClassResponse> {
    let classImageUrl = '';

    const updateItem: any = updateClassRequest;

    if (classImage) {
      const awsRegion = 'ap-northeast-2';

      const bucketName = 'skkulife';

      const client = new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_KEY,
        },
      });

      const extSplit = classImage.originalname.split('.');
      const ext = extSplit[extSplit.length - 1];

      const key = `${Date.now().toString()}_${updateClassRequest.classId}.${ext}`;

      const params = {
        Key: key,
        Body: classImage.buffer,
        Bucket: bucketName,
        ContentType: classImage.mimetype,
        ContentEncoding: 'base64',
        ACL: ObjectCannedACL.public_read,
      };

      const command = new PutObjectCommand(params);

      await client.send(command);

      classImageUrl = `https://skkulife.s3.ap-northeast-2.amazonaws.com/${key}`;
      updateItem.classImage = classImageUrl;
    }

    const classItem: any = await this.classModel.update(
      {
        PK: updateClassRequest.classId,
        SK: `class#${updateClassRequest.classId}`,
      },
      { $SET: updateItem },
      { returnValues: 'UPDATED_NEW', return: 'item' },
    );

    const members = await this.getClassUser(updateClassRequest.classId);
    classItem.classMember = members;

    return classItem;
  }

  async deleteClass(classId: string): Promise<void> {
    const classRelatedItems = await this.classModel
      .query('PK')
      .eq(classId)
      .all()
      .exec();

    for (let i = 0; i < classRelatedItems.length; i++) {
      await this.classModel.delete({
        PK: classId,
        SK: classRelatedItems[i].SK,
      });
    }

    const members: any = await this.userClassModel
      .query('SK')
      .eq(`class#${classId}`)
      .using('inverted-index')
      .all()
      .exec();

    for (let i = 0; i < members.length; i++) {
      const memberClassRelatedItems: any = await this.userClassModel
        .query('PK')
        .eq(members[i].PK)
        .filter('SK')
        .beginsWith('class#')
        .exec();

      for (let j = 0; j < memberClassRelatedItems.length; j++) {
        await this.userClassModel.delete({
          PK: members[i].PK,
          SK: memberClassRelatedItems[j].SK,
        });
      }
    }

    return;
  }

  async joinClass(email: string, classCode: string): Promise<ClassResponse> {
    const classItem: any = (await this.getClassByClassCode(classCode))[0];

    if (classItem) {
      const userClassItem = {
        PK: email,
        SK: `class#${classItem.PK}`,
        classId: classItem.PK,
      };

      await this.userClassModel.create(userClassItem);
    }

    const members = await this.getClassUser(classItem.PK);
    classItem.classMember = members;

    return classItem;
  }

  async leaveClass(email: string, classId: string): Promise<void> {
    await this.userClassModel.delete({ PK: email, SK: `class#${classId}` });
    return;
  }

  async getClass(classId: string): Promise<Class[]> {
    return this.classModel
      .query('PK')
      .eq(classId)
      .filter('SK')
      .all()
      .eq(`class#${classId}`)
      .exec();
  }

  async getClassByClassId(classId: string): Promise<ClassResponse> {
    const classItem: any = (await this.getClass(classId))[0];

    const members = await this.getClassUser(classId);
    classItem.classMember = members;

    return classItem;
  }

  async getClassByClassCode(classCode: string): Promise<Class[]> {
    return this.classModel
      .query('classCode')
      .eq(classCode)
      .using('classCode-index')
      .all()
      .exec();
  }

  async getClassUser(classId: string): Promise<UserInfo[]> {
    const members: any = await this.userClassModel
      .query('SK')
      .eq(`class#${classId}`)
      .using('inverted-index')
      .all()
      .exec();

    const classMember = [];

    for (let i = 0; i < members.length; i++) {
      if (members[i].classImage) continue;
      const member = (await this.userService.getUserInfo(members[i].PK))[0];

      classMember.push({
        userName: member.name,
        userImage: member.profile,
      });
    }

    return classMember;
  }

  async getUserClasses(email: string): Promise<ClassResponse[]> {
    const userClasses = (
      await this.userClassModel
        .query('PK')
        .eq(email)
        .filter('SK')
        .beginsWith('class#')
        .exec()
    ).filter((item) => item.classId);

    const classes = [];

    for (let i = 0; i < userClasses.length; i++) {
      const classItem: any = (await this.getClass(userClasses[i].classId))[0];

      delete classItem.PK;
      delete classItem.SK;

      const classMember = await this.getClassUser(userClasses[i].classId);

      classItem.classMember = classMember;

      classes.push(classItem);
    }

    return classes;
  }

  async getStatistics(classId: string): Promise<StatisticsResponse> {
    console.log('classId', classId);

    return {
      chart: [
        {
          date: '2024-11-25',
          total: 4,
          notVerified: 3,
          pending: 0,
          success: 1,
          fail: 0,
        },
        {
          date: '2024-11-26',
          total: 4,
          notVerified: 3,
          pending: 0,
          success: 1,
          fail: 0,
        },
        {
          date: '2024-11-27',
          total: 4,
          notVerified: 3,
          pending: 0,
          success: 0,
          fail: 1,
        },
        {
          date: '2024-11-28',
          total: 4,
          notVerified: 3,
          pending: 0,
          success: 1,
          fail: 0,
        },
        {
          date: '2024-11-29',
          total: 4,
          notVerified: 1,
          pending: 0,
          success: 2,
          fail: 1,
        },
        {
          date: '2024-11-30',
          total: 5,
          notVerified: 2,
          pending: 3,
          success: 0,
          fail: 0,
        },
      ],
    };
  }
}
