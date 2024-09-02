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
  Request,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductQueryDto,
} from './dto';
import { RolesGuard, JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { Role } from '@prisma/client';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { handleError } from 'src/utils';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBody({
    type: CreateProductDto,
    examples: {
      example1: {
        summary: 'New Product',
        value: {
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 999.99,
          quantity: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.productsService.create(
        req.user.userId,
        createProductDto,
      );
      res
        .status(HttpStatus.CREATED)
        .json({ message: 'Product created successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Query() query: ProductQueryDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const user = req.user || null;
      const userId = user ? user.userId : undefined;
      const userRole = user ? user.role : undefined;

      const data = await this.productsService.findAll(query, userId, userRole);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Products fetched successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      const user = req.user || null;
      const userId = user ? user.userId : undefined;
      const userRole = user ? user.role : undefined;

      const data = await this.productsService.findOne(id, userId, userRole);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Product fetched successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Patch(':id')
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      example1: {
        summary: 'Update Product Price',
        value: { price: 899.99 },
      },
    },
  })
  @ApiResponse({ type: ProductResponseDto })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const data = await this.productsService.update(
        id,
        req.user.userId,
        updateProductDto,
        req.user.role,
      );

      res
        .status(HttpStatus.OK)
        .json({ message: 'Product updated successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req, @Res() res: Response) {
    try {
      await this.productsService.remove(id, req.user.userId, req.user.role);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Product deleted successfully' });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approve(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.productsService.approve(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Product approved successfuly', data });
    } catch (error) {
      handleError(res, error);
    }
  }

  @Post(':id/disapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async disapprove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.productsService.disapprove(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Product disapproved successfully', data });
    } catch (error) {
      handleError(res, error);
    }
  }
}
