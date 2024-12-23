import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninRequest {
  @ApiProperty({
    description: '사용자 이메일 데이터',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호 데이터',
  })
  @IsNotEmpty()
  @IsString()
  pwd: string;
}
