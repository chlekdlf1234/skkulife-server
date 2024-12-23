import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCodeMail(to: string, code: string) {
    try {
      await this.mailerService.sendMail({
        from: 'no-reply@skkulife.xyz',
        to,
        subject: 'SKKULIFE Verification Code',
        text: code,
      });
    } catch (err) {
      throw err;
    }
  }

  async sendPenaltyMail(to: string, name: string, studentId: string) {
    try {
      await this.mailerService.sendMail({
        from: 'no-reply@skkulife.xyz',
        to,
        subject: `[SKKULIFE] ${name}님이 오늘도 게으른 하루를 보냈어요`,
        text: `${studentId}학번의 ${name}님은 오늘도 친구들과의 약속을 지키지 않고 게으르고 나태한 하루를 보냈답니다.`,
      });
    } catch (err) {
      throw err;
    }
  }
}
