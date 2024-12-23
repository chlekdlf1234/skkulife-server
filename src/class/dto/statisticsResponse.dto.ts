import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Statistics {
  @ApiProperty({
    description: '날짜',
  })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({
    description: '전체 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty({
    description: '미인증 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  notVerified: number;

  @ApiProperty({
    description: '인증 대기 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  pending: number;

  @ApiProperty({
    description: '인증 실패 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  fail: number;

  @ApiProperty({
    description: '인증 성공 인원',
  })
  @IsNotEmpty()
  @IsNumber()
  success: number;
}

export class StatisticsResponse {
  @ApiProperty({
    description: '모임 참여 멤버',
  })
  @ValidateNested()
  @Type(() => Statistics)
  chart: Statistics[];
}
