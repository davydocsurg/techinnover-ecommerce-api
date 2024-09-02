import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'User name' })
  name?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Ban or unban user' })
  isBanned?: boolean;
}
