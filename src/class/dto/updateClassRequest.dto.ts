import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassRequest {
  @ApiProperty({
    description: '모임 ID',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: '모임 이름',
  })
  @IsNotEmpty()
  @IsString()
  className: string;

  @ApiProperty({
    description: '모임 방장',
  })
  @IsNotEmpty()
  @IsString()
  manager: string;

  @ApiProperty({
    description: '모임 설명',
  })
  @IsNotEmpty()
  @IsString()
  classDescription: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  classImage: Express.Multer.File;

  @ApiProperty({
    description: '모임 초대 코드',
  })
  @IsNotEmpty()
  @IsString()
  classCode: string;

  @ApiProperty({
    description: '모임 요일',
  })
  @IsNotEmpty()
  classDate: string[];

  @ApiProperty({
    description: '모임 시작 시간',
  })
  @IsNotEmpty()
  @IsString()
  classStartTime: string;

  @ApiProperty({
    description: '모임 마감 시간',
  })
  @IsNotEmpty()
  @IsString()
  classEndTime: string;

  @ApiProperty({
    description: '인증 마감 시간',
  })
  @IsNotEmpty()
  @IsNumber()
  voteEnd: number;

  @ApiProperty({
    description: '인증 성공 퍼센트',
  })
  @IsNotEmpty()
  @IsNumber()
  votePercent: number;

  @ApiProperty({
    description: '모임 벌칙 종류 (1로 고정)',
  })
  @IsNotEmpty()
  @IsNumber()
  penaltyType: number;
}
