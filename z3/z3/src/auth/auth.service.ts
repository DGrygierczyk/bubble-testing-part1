import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private users: User[] = [];

  constructor(private jwtService: JwtService) {}

  async onModuleInit() {
    // Hash password during initialization
    const hashedPassword = await bcrypt.hash('password123', 10);
    this.users = [
      {
        id: 1,
        username: 'testuser',
        password: hashedPassword,
      },
    ];
    this.logger.debug(`Initialized test user with hashed password`);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${username}`);
    const user = this.users.find(user => user.username === username);
    if (!user) {
      this.logger.debug('User not found');
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    this.logger.debug(`Password valid: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    this.logger.debug(`Logging in user: ${JSON.stringify(user)}`);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
} 