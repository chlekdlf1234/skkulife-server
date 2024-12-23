import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { VerificationResponse } from './dto/verificationResponse.dto';
import { VoteRequest } from './dto/voteRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRequest } from './dto/uploadResquest.dto';
import { AuthUser } from '../common/decorator/user.decorator';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get(':classId/:date')
  @ApiOperation({
    summary: 'Get Class Verification By Date API',
    description: 'Class의 해당 날짜 모든 인증 정보 가져오기',
  })
  @ApiCreatedResponse({
    description: 'Class의 해당 날짜의 모든 인증 정보',
    type: VerificationResponse,
  })
  async getVerificationsByDate(
    @Param('classId') classId: string,
    @Param('date') date: string,
  ): Promise<VerificationResponse> {
    return await this.verificationService.getVerificationsByDate(classId, date);
  }

  @Post('/vote')
  @ApiOperation({
    summary: 'Vote API',
    description: '인증 투표',
  })
  @ApiCreatedResponse({
    description: '투표한 인증의 최신화 데이터',
    type: VerificationResponse,
  })
  async vote(
    @AuthUser() email: string,
    @Body() voteRequest: VoteRequest,
  ): Promise<VerificationResponse> {
    return await this.verificationService.vote(
      email,
      voteRequest.classId,
      voteRequest.verificationId,
      voteRequest.vote,
    );
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('verification'))
  @ApiOperation({
    summary: 'Upload Verification API',
    description: '인증 게시물 업로드',
  })
  @ApiCreatedResponse({
    description: '업로드 된 인증 게시물',
    type: VerificationResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: `The form data for uploading verification`,
    type: UploadRequest,
  })
  async uploadVerification(
    @AuthUser() email: string,
    @UploadedFile() verification: Express.Multer.File,
    @Body() uploadRequest: UploadRequest,
  ): Promise<VerificationResponse> {
    return await this.verificationService.upload(
      email,
      uploadRequest.classId,
      verification,
    );
  }
}
