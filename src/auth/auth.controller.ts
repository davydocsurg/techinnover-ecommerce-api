import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthTokensDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { handleError } from 'src/utils';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'New User Registration',
        value: {
          name: 'John Doe',
          email: 'user@example.com',
          password: 'password123#',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: AuthTokensDto,
  })
  @UsePipes(new ValidationPipe())
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const data = await this.authService.register(registerDto);
      this.setTokenCookies(res, data);
      res
        .status(HttpStatus.CREATED)
        .json({ message: 'User registered successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'User Login',
        value: { email: 'user@example.com', password: 'password123#' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged in successfully',
    type: AuthTokensDto,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    try {
      const data = await this.authService.login(loginDto);
      this.setTokenCookies(res, data);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Logged in successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully',
    type: AuthTokensDto,
  })
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.user['sub'];
      const tokens = await this.authService.refreshTokens(userId);
      this.setTokenCookies(res, tokens);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiCookieAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged out successfully',
  })
  async logout(@Res() res: Response): Promise<void> {
    try {
      this.clearTokenCookies(res);
      res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  private setTokenCookies(res: Response, tokens: AuthTokensDto): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction, // Set secure flag based on environment
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction, // Set secure flag based on environment
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
