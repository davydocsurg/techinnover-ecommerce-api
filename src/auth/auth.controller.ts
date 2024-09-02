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
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
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
      res.status(201).json({ message: 'User registered successfully', data });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @Post('login')
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'User Login',
        value: { email: 'user@example.com', password: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully',
    type: AuthTokensDto,
  })
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    try {
      const data = await this.authService.login(loginDto);
      this.setTokenCookies(res, data);
      res.json({ message: 'Logged in successfully', data });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
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
      res.json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res() res: Response): Promise<void> {
    try {
      this.clearTokenCookies(res);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      this.handleError(res, error);
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

  private handleError(res: Response, error: any): void {
    if (error instanceof HttpException) {
      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: error.getResponse(),
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }
}
