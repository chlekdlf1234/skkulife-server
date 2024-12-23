import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
