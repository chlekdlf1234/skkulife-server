import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfigService } from './common/dynamoDB/dynamoose-config.service';
import { SharedModule } from './common/dynamoDB/shared-dynamoose.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AccountGuard } from './auth/guards/account.guard';
import { ClassModule } from './class/class.module';
import { VerificationModule } from './verification/verification.module';
import { PenaltyModule } from './penalty/penalty.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: '365d' },
      global: true,
    }),
    DynamooseModule.forRootAsync({ useClass: DynamooseConfigService }),
    SharedModule,
    AuthModule,
    UserModule,
    MailModule,
    ClassModule,
    VerificationModule,
    PenaltyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountGuard,
    },
  ],
})
export class AppModule {}
