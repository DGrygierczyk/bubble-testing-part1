import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.debug('User validation failed');
      throw new UnauthorizedException();
    }
    this.logger.debug('User validation successful');
    return user;
  }
} 