import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequest {
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

  @ApiProperty({
    description: '사용자 닉네임 데이터',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '사용자 닉네임 데이터',
  })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  profile: Express.Multer.File;
}
