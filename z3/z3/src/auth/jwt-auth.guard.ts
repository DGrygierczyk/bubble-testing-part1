import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(`JWT Guard - Error: ${err}, User: ${JSON.stringify(user)}, Info: ${JSON.stringify(info)}`);
    if (err || !user) {
      this.logger.debug('JWT Guard - Authentication failed');
      throw new UnauthorizedException();
    }
    this.logger.debug('JWT Guard - Authentication successful');
    return user;
  }
} 