import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PenaltyLog {
  @ApiProperty({
    description: '벌칙 메세지 종류',
  })
  @IsNotEmpty()
  @IsString()
  alarmType: string;

  @ApiProperty({
    description: '벌칙 메세지',
  })
  @IsNotEmpty()
  @IsString()
  alarmMessage: string;

  @ApiProperty({
    description: '벌칙 시간',
  })
  @IsNotEmpty()
  @IsString()
  alaramDate: string;
}

export class PenaltyLogResponse {
  @ApiProperty({
    description: '벌칙 로그',
  })
  @ValidateNested()
  @Type(() => PenaltyLog)
  penaltyLogs: PenaltyLog[];
}
