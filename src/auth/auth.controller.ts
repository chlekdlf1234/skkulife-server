import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../common/decorator/skip-auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninRequest } from './dto/signinRequest.dto';
import { SigninResponse } from './dto/signinResponse.dto';
import { SignupRequest } from './dto/signupRequest.dto';
import { SignupResponse } from './dto/signupResponse.dto';
import { VerifyCodeRequest } from './dto/verifyCodeRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { NoAccountGuard } from '../common/decorator/no-account-guard.decorator';
import { AuthUser } from '../common/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  @ApiOperation({
    summary: 'SignIn API',
    description: 'SignIn 진행',
  })
  @ApiCreatedResponse({
    description: '로그인 된 유저 관련 데이터',
    type: SigninResponse,
  })
  async signIn(@Body() signinRequest: SigninRequest): Promise<SigninResponse> {
    return await this.authService.signIn(signinRequest.email);
  }

  @Public()
  @Post('/signup')
  @UseInterceptors(FileInterceptor('profile'))
  @ApiOperation({
    summary: 'SignUp API',
    description: 'SignUp 진행',
  })
  @ApiCreatedResponse({
    description: '로그인 된 유저 관련 데이터',
    type: SignupResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: `The form data for sign up`, type: SignupRequest })
  async signUp(
    @UploadedFile() profile: Express.Multer.File,
    @Body() signupRequest: SignupRequest,
  ): Promise<SignupResponse> {
    return await this.authService.signUp(
      profile,
      signupRequest.email,
      signupRequest.pwd,
      signupRequest.name,
      signupRequest.studentId,
    );
  }

  @NoAccountGuard()
  @Post('/verify-code')
  @ApiOperation({
    summary: 'Code Verification API',
    description: 'Email Code 검증 진행',
  })
  async verifyCode(
    @AuthUser() email: string,
    @Body() verifyCodeRequest: VerifyCodeRequest,
  ): Promise<void> {
    await this.authService.verifyEmailCode(email, verifyCodeRequest.code);
  }
}
