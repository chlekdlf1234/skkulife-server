import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ClassResponse } from '../../class/dto/classResponse.dto';

export class UserInfoResponse {
  @ApiProperty({
    description: '유저 이름',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: '유저 이미지 URL',
  })
  @IsNotEmpty()
  @IsString()
  userImage: string;

  @ApiProperty({
    description: '유저 이메일',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: '유저 참여 모임',
  })
  @ValidateNested()
  @Type(() => ClassResponse)
  userClass: ClassResponse[];
}
