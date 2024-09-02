import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @ApiProperty({ description: 'Product name', type: String })
  name?: string;

  @Min(0)
  @ApiProperty({ description: 'Product price', type: Number })
  price: Decimal;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Product description', type: String })
  description: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Product quantity', type: Number })
  quantity: number;
}
