import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ClassMemberDetail {
  @ApiProperty({
    description: '모임 멤버 이름',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    description: '모임 멤버 프로필 URL',
  })
  @IsString()
  userImage: string;
}

export class ClassResponse {
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
    description: '모임 이미지 URL',
  })
  @IsNotEmpty()
  @IsString()
  classImage: string;

  @ApiProperty({
    description: '모임 설명',
  })
  @IsNotEmpty()
  @IsString()
  classDescription: string;

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
  @IsNumber()
  classStartTime: string;

  @ApiProperty({
    description: '모임 마감 시간',
  })
  @IsNotEmpty()
  @IsNumber()
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

  @ApiProperty({
    description: '모임 참여 멤버',
  })
  @ValidateNested()
  @Type(() => ClassMemberDetail)
  classMember: ClassMemberDetail[];
}
