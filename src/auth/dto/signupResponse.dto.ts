import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UserInfo {
  @ApiProperty({
    description: '사용자 이메일',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: '사용자 권한',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({
    description: '사용자 이메일 인증 여부',
  })
  @IsNotEmpty()
  @IsBoolean()
  isVerified: boolean;
}

export class SignupResponse {
  @ApiProperty({
    description: '가입 유저 정보',
  })
  @ValidateNested()
  @Type(() => UserInfo)
  userInfo: UserInfo;

  @ApiProperty({
    description: 'Auth 토큰',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
