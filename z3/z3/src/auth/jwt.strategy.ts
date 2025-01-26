import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT Strategy - Validating payload: ${JSON.stringify(payload)}`);
    const user = { userId: payload.sub, username: payload.username };
    this.logger.debug(`JWT Strategy - Validated user: ${JSON.stringify(user)}`);
    return user;
  }
} 