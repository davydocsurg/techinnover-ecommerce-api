import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductResponseDto {
  @Expose()
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Product name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Product price', type: Number })
  price: Decimal;

  @Expose()
  @ApiProperty({ description: 'Product description' })
  description: string;

  @Expose()
  @ApiProperty({ description: 'Product quantity' })
  quantity: number;

  @Expose()
  @ApiProperty({ description: 'Product approval status' })
  isApproved: boolean;

  @Expose()
  @ApiProperty({ description: 'User ID who created the product' })
  userId: string;

  @Expose()
  @ApiProperty({ description: 'Product creation date' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Product update date' })
  updatedAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
