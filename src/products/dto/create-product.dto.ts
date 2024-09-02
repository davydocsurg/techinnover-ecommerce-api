import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Product name' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Product price', type: Number })
  price: Decimal;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Product description' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Product quantity' })
  quantity: number;
}
