import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadRequest {
  @ApiProperty({
    description: '모임 ID',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  verification: Express.Multer.File;
}
