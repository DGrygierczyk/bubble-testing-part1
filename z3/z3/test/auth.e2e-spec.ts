import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    jwtService = moduleRef.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should authenticate user and return JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      
      const decodedToken = jwtService.verify(response.body.access_token);
      expect(decodedToken.username).toBe('testuser');
    });

    it('should fail with invalid credentials', async () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);
    });

    it('should protect routes with JWT guard', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      const token = loginResponse.body.access_token;

      await request(app.getHttpServer())
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/protected')
        .expect(401);

      await request(app.getHttpServer())
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
}); 