import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  price: Decimal;

  @Expose()
  description: string;

  @Expose()
  quantity: number;

  @Expose()
  isApproved: boolean;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
