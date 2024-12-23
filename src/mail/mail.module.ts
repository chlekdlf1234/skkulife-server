import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  exports: [MailService],
  providers: [MailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'no-reply@skkulife.xyz',
          pass: 'thxc yoav fkbq rmok',
        },
      },
      preview: true,
    }),
  ],
})
export class MailModule {}
