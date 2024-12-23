import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClassService } from './class.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateClassRequest } from './dto/createClassRequest.dto';
import { ClassResponse } from './dto/classResponse.dto';
import { JoinClassRequest } from './dto/joinClassRequest.dto';
import { DeleteClassRequest } from './dto/deleteClassRequest.dto';
import { StatisticsResponse } from './dto/statisticsResponse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateClassRequest } from './dto/updateClassRequest.dto';
import { AuthUser } from '../common/decorator/user.decorator';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('/create-class')
  @UseInterceptors(FileInterceptor('classImage'))
  @ApiOperation({
    summary: 'Create Class API',
    description: 'Class 개설하기',
  })
  @ApiCreatedResponse({
    description: '개설한 Class 정보',
    type: ClassResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: `The form data for class creation`,
    type: CreateClassRequest,
  })
  async createClass(
    @UploadedFile() classImage: Express.Multer.File,
    @AuthUser() email: string,
    @Body() createClassRequest: CreateClassRequest,
  ): Promise<ClassResponse> {
    return await this.classService.createClass(
      classImage,
      email,
      createClassRequest,
    );
  }

  @Post('/update-class')
  @UseInterceptors(FileInterceptor('classImage'))
  @ApiOperation({
    summary: 'Update Class API',
    description: 'Class 설정 변경하기',
  })
  @ApiCreatedResponse({
    description: '변경 된 Class 정보',
    type: ClassResponse,
  })
  @ApiCreatedResponse({
    description: '개설한 Class 정보',
    type: ClassResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: `The form data for class update`,
    type: UpdateClassRequest,
  })
  async updateClass(
    @UploadedFile() classImage: Express.Multer.File,
    @Body() updateClassRequest: UpdateClassRequest,
  ): Promise<ClassResponse> {
    return await this.classService.updateClass(classImage, updateClassRequest);
  }

  @Post('/delete-class')
  @ApiOperation({
    summary: 'Delete Class API',
    description: 'Class 삭제하기',
  })
  async deleteClass(
    @Body() deleteClassRequest: DeleteClassRequest,
  ): Promise<void> {
    await this.classService.deleteClass(deleteClassRequest.classId);
  }

  @Post('/join-class')
  @ApiOperation({
    summary: 'Join Class API',
    description: 'Class 참여하기',
  })
  @ApiCreatedResponse({
    description: '참여한 Class 정보',
    type: ClassResponse,
  })
  async joinClass(
    @AuthUser() email: string,
    @Body() joinClassRequest: JoinClassRequest,
  ): Promise<ClassResponse> {
    return await this.classService.joinClass(email, joinClassRequest.classCode);
  }

  @Post('/leave-class')
  @ApiOperation({
    summary: 'Leave Class API',
    description: 'Class 탈퇴하기',
  })
  async leaveClass(
    @AuthUser() email: string,
    @Body() leaveClassRequest: DeleteClassRequest,
  ): Promise<void> {
    await this.classService.leaveClass(email, leaveClassRequest.classId);
  }

  @Get(':email')
  @ApiOperation({
    summary: 'Get Classes API',
    description: '참여한 모든 Class 정보 획득',
  })
  @ApiCreatedResponse({
    description: '참여한 Classes 정보',
    type: [ClassResponse],
  })
  async getClasses(@Param('email') email: string): Promise<ClassResponse[]> {
    return await this.classService.getUserClasses(email);
  }

  @Get(':classId')
  @ApiOperation({
    summary: 'Get Class API',
    description: 'Class ID에 해당하는 Class 정보 획득',
  })
  @ApiCreatedResponse({
    description: 'Class 정보',
    type: ClassResponse,
  })
  async getClass(@Param('classId') classId: string): Promise<ClassResponse> {
    return await this.classService.getClassByClassId(classId);
  }

  @Get(':classId/statistics')
  @ApiOperation({
    summary: 'Get Class Statistics API',
    description: 'Class 통계 정보 획득',
  })
  @ApiCreatedResponse({
    description: 'Classes 통계 정보',
    type: StatisticsResponse,
  })
  async getClassStatistics(
    @Param('classId') classId: string,
  ): Promise<StatisticsResponse> {
    return await this.classService.getStatistics(classId);
  }
}
