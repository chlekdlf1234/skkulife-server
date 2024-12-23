import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninResponse {
  @ApiProperty({
    description: '사용자 인증 토큰',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
