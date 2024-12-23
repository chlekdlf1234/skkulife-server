import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteClassRequest {
  @ApiProperty({
    description: '모임 ID',
  })
  @IsNotEmpty()
  @IsString()
  classId: string;
}
