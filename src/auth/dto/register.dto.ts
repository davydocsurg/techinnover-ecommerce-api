import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User name' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'User email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ description: 'User password' })
  password: string;
}
