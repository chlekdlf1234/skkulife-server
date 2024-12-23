import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GivePenaltyRequest {
  @ApiProperty({
    description: '벌칙 대상자가 속한 모임',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: '벌칙 대상자',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}
