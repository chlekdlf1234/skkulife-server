import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { PenaltyLogResponse } from './dto/penaltyLogResponse.dto';
import { GivePenaltyRequest } from './dto/givePenaltyRequest.dto';

@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get(':classId/log')
  @ApiOperation({
    summary: 'Get Penalty Log API',
    description: '모임 벌칙 정보 획득하기',
  })
  @ApiCreatedResponse({
    description: '모임 벌칙 정보',
    type: PenaltyLogResponse,
  })
  async getPenaltyLog(
    @Param('classId') classId: string,
  ): Promise<PenaltyLogResponse> {
    return await this.penaltyService.getPenaltyLog(classId);
  }

  @Post('')
  @ApiOperation({
    summary: 'Give Penalty API',
    description: '모임 벌칙 부과',
  })
  async givePenalty(
    @Body() givePenaltyRequest: GivePenaltyRequest,
  ): Promise<void> {
    await this.penaltyService.givePenalty(
      givePenaltyRequest.classId,
      givePenaltyRequest.email,
    );
  }
}
