import { AuthTokensDto } from './auth-tokens.dto';
import { Role } from '@prisma/client';

class UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBanned: boolean;
}

export class RegisterResponseDto extends AuthTokensDto {
  user: UserWithoutPassword;
}
