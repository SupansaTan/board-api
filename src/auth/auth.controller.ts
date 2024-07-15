import { ObjectProperty } from './../common/swagger/custom-response';
import { Body, Controller, Post, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException, NotFoundException, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ISignInRequest, ISignInResponse } from 'src/common/interface/signIn.dto';
import { ApiResponseWithType } from 'src/common/swagger/custom-response';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(ISignInResponse)
  @ApiResponse(ApiResponseWithType(ObjectProperty(getSchemaPath(ISignInResponse))))
  login(@Body() loginDto: ISignInRequest): ISignInResponse {
    return this.authService.login(loginDto.username);
  }
}
