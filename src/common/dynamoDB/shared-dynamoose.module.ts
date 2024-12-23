import { Global, Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserInfoSchema } from './schema/userInfo.schema';
import { EmailCodeSchema } from './schema/emailCode.schema';
import { ClassSchema } from './schema/class.schema';
import { UserClassSchema } from './schema/userClass.schema';
import { VerificationSchema } from './schema/verification.schema';
import { PenaltySchema } from './schema/penalty.schema';

@Global()
@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: `${process.env.STAGE}-skkulife`,
        schema: [
          UserInfoSchema,
          EmailCodeSchema,
          ClassSchema,
          UserClassSchema,
          VerificationSchema,
          PenaltySchema,
        ],
      },
    ]),
  ],
  exports: [DynamooseModule],
})
export class SharedModule {}
