import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductQueryDto,
} from './dto';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      await this.validateProductNameUniqueness(createProductDto.name);

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          userId,
        },
      });

      return new ProductResponseDto(product);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(
    query: ProductQueryDto,
    userId?: string,
    userRole?: Role,
  ): Promise<{ products: ProductResponseDto[]; total: number }> {
    try {
      const {
        search,
        isApproved,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;
      const skip = (page - 1) * limit;

      let where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ];
      }

      if (isApproved !== undefined) {
        where.isApproved = isApproved;
      }

      if (!userRole) {
        // Unauthenticated users
        where.isApproved = true;
      } else if (userRole !== Role.ADMIN) {
        // Authenticated users
        where.OR = [...(where.OR || []), { userId }, { isApproved: true }];
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.product.count({ where }),
      ]);

      return {
        products: products.map((product) => new ProductResponseDto(product)),
        total,
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findOne(
    id: string,
    userId?: string,
    userRole?: Role,
  ): Promise<ProductResponseDto> {
    try {
      const product = await this.validateProductExistence(id);
      this.validateProductVisibility(product, userId, userRole);
      return new ProductResponseDto(product);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(
    id: string,
    userId: string,
    updateProductDto: UpdateProductDto,
    userRole: Role,
  ): Promise<ProductResponseDto> {
    try {
      const product = await this.validateProductExistence(id);
      this.validateUserAuthorization(product, userId, userRole);
      await this.validateProductNameUniqueness(updateProductDto.name, id);

      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return new ProductResponseDto(updatedProduct);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(
    id: string,
    userId: string,
    userRole: Role,
  ): Promise<{ message: string }> {
    try {
      const product = await this.validateProductExistence(id);
      this.validateUserAuthorization(product, userId, userRole);

      await this.prisma.product.delete({ where: { id } });

      return { message: 'Product successfully deleted' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async approve(id: string): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { isApproved: true },
      });
      return new ProductResponseDto(product);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async disapprove(id: string): Promise<ProductResponseDto> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: { isApproved: false },
      });
      return new ProductResponseDto(product);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private async validateProductExistence(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  private validateUserAuthorization(
    product: any,
    userId: string,
    userRole: Role,
  ) {
    if (product.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
  }

  private validateProductVisibility(
    product: any,
    userId: string,
    userRole: Role,
  ) {
    if (
      !product.isApproved &&
      product.userId !== userId &&
      userRole !== Role.ADMIN
    ) {
      throw new ForbiddenException(
        'You are not authorized to view this product',
      );
    }
  }

  private async validateProductNameUniqueness(name: string, id?: string) {
    if (name) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { name },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this name already exists');
      }
    }
  }

  private handlePrismaError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new BadRequestException('Invalid data provided');
    }
    throw error;
  }
}
