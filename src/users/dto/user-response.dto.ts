import { Exclude, Expose } from 'class-transformer';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ description: 'User ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'User name' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'User email' })
  email: string;

  @Expose()
  @ApiProperty({ description: 'User role' })
  role: Role;

  @Expose()
  @ApiProperty({ description: 'User banned if true' })
  isBanned: boolean;

  @Expose()
  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'User update date' })
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
