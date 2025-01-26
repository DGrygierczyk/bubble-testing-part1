import { Controller, Get, UseGuards, HttpCode, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  @HttpCode(200)
  getProtected() {
    this.logger.debug('Protected route accessed');
    return { message: 'This is a protected route' };
  }
} 