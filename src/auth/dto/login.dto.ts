import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'User email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User password' })
  password: string;
}
