import { Injectable } from '@nestjs/common';
import { PenaltyLogResponse } from './dto/penaltyLogResponse.dto';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Penalty, PenaltyKey } from './interfaces/penalty.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PenaltyService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,

    @InjectModel(`${process.env.STAGE}-skkulife`)
    private readonly penaltyModel: Model<Penalty, PenaltyKey>,
  ) {}

  async getPenaltyLog(classId: string): Promise<PenaltyLogResponse> {
    const penalties = await this.penaltyModel
      .query('PK')
      .eq(classId)
      .filter('SK')
      .beginsWith('penalty#')
      .exec();

    const penaltyLogs = [];

    for (let i = 0; i < penalties.length; i++) {
      delete penalties[i].PK;
      delete penalties[i].SK;

      penaltyLogs.push(penalties[i]);
    }

    return {
      penaltyLogs,
    };
  }

  async givePenalty(classId: string, email: string): Promise<void> {
    const penaltyId = uuidv4();

    const penaltyUserInfo = (await this.userService.getUserInfo(email))[0];
    const allUsers = await this.userService.getAllUser();

    const randomUserInfo =
      allUsers[Math.floor(Math.random() * allUsers.length)];

    await this.mailService.sendPenaltyMail(
      randomUserInfo.email,
      penaltyUserInfo.name,
      penaltyUserInfo.studentId,
    );

    const penaltyItem = {
      PK: classId,
      SK: `penalty#${penaltyId}`,
      alaramDate: new Date().toISOString(),
      alarmType: 'penalty',
      alarmMessage: `${penaltyUserInfo.name}님에 대한 벌칙 메일이 랜덤 학우(${randomUserInfo.name})님에게 발송 됐습니다.`,
    };

    await this.penaltyModel.create(penaltyItem);
  }
}
