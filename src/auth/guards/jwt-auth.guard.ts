import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('Validating JWT token');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    this.logger.debug('Handling JWT token validation');
    if (err || !user) {
      this.logger.error('JWT token validation failed:', err || info.message);
      throw err || info;
    }
    return user;
  }
}

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Allow the request to pass through even if no user is found
    return user || null;
  }
}
