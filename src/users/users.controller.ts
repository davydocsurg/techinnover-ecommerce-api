import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { handleError } from 'src/utils';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.findAll(page, limit);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Users fetched successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.usersService.findOne(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'User fetched successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      example1: {
        summary: 'Update User Name',
        value: { name: 'Jane Doe' },
      },
    },
  })
  @ApiResponse({ type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.update(id, updateUserDto);
      res
        .status(HttpStatus.OK)
        .json({ message: 'User updated successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.usersService.remove(id);
      res.status(HttpStatus.OK).json({ message: 'User deleted successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Post(':id/ban')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User banned successfully',
    type: UserResponseDto,
  })
  async banUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.usersService.update(id, { isBanned: true });
      res
        .status(HttpStatus.OK)
        .json({ message: 'User banned successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Post(':id/unban')
  async unbanUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.usersService.update(id, { isBanned: false });
      res
        .status(HttpStatus.OK)
        .json({ message: 'User unbanned successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }
}
