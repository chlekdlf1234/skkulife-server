import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { AuthUser } from '../common/decorator/user.decorator';
import { UserInfoResponse } from './dto/userInfoResponse.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  @ApiOperation({
    summary: 'Get User Info API',
    description: '유저 정보',
  })
  @ApiCreatedResponse({
    description: '유저 정보',
    type: UserInfoResponse,
  })
  async getUserInfo(@AuthUser() email: string): Promise<UserInfoResponse> {
    return await this.userService.getUserMyPageInfo(email);
  }
}
