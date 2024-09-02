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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

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
  @ApiResponse({ type: ProductResponseDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(req.user.userId, createProductDto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Query() query: ProductQueryDto, @Request() req) {
    const user = req.user || null;
    const userId = user ? user.userId : undefined;
    const userRole = user ? user.role : undefined;

    return this.productsService.findAll(query, userId, userRole);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ProductResponseDto> {
    const user = req.user || null;
    const userId = user ? user.userId : undefined;
    const userRole = user ? user.role : undefined;

    return this.productsService.findOne(id, userId, userRole);
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
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(
      id,
      req.user.userId,
      updateProductDto,
      req.user.role,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    return this.productsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approve(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.approve(id);
  }

  @Post(':id/disapprove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async disapprove(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.disapprove(id);
  }
}
