import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinClassRequest {
  @ApiProperty({
    description: '모임 초대 코드',
  })
  @IsNotEmpty()
  @IsString()
  classCode: string;
}
