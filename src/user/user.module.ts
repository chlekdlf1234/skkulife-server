import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClassModule } from '../class/class.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [forwardRef(() => ClassModule)],
  exports: [UserService],
})
export class UserModule {}
