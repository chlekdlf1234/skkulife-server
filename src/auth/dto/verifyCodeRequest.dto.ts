import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeRequest {
  @ApiProperty({
    description: '사용자 이메일 인증 데이터',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
