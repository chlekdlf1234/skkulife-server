import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Verification {
  @ApiProperty({
    description: '인증 업로더 이름',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: '인증 사진',
  })
  @IsNotEmpty()
  @IsString()
  verificationImage: string;

  @ApiProperty({
    description: '인증 날짜',
  })
  @IsNotEmpty()
  @IsString()
  verificationDate: string;

  @ApiProperty({
    description: '인증 상태 (0: 진행 중, 1: 성공, 2: 실패)',
  })
  @IsNotEmpty()
  @IsNumber()
  verificationStatus: number;

  @ApiProperty({
    description: '인증 성공 투표 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  yesVote: number;

  @ApiProperty({
    description: '인증 실패 투표 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  noVote: number;
}

export class VerificationResponse {
  @ApiProperty({
    description: '모임 인증 데이터',
  })
  @ValidateNested()
  @Type(() => Verification)
  verifications: Verification[];
}
