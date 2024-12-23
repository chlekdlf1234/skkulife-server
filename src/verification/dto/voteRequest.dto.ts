import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteRequest {
  @ApiProperty({
    description: '모임 ID',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({
    description: '인증 게시물 ID',
  })
  @IsNotEmpty()
  @IsString()
  verificationId: string;

  @ApiProperty({
    description: '찬성 - true, 반대 - false',
  })
  @IsNotEmpty()
  @IsBoolean()
  vote: boolean;
}
