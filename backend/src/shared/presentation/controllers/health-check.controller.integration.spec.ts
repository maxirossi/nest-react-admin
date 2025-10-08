import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import * as request from 'supertest';

import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from '../../application/services/health-check.service';
import { SharedModule } from '../../shared.module';

describe('HealthCheckController (Integration)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [],
          synchronize: true,
        }),
        SharedModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<Connection>(Connection);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('version');
      expect(response.body.services).toHaveProperty('database');
      expect(response.body.services).toHaveProperty('memory');
    });

    it('should return database status', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Assert
      expect(response.body.services.database).toBe('connected');
    });

    it('should return memory usage information', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Assert
      expect(response.body.services.memory).toHaveProperty('used');
      expect(response.body.services.memory).toHaveProperty('total');
      expect(response.body.services.memory).toHaveProperty('percentage');
      expect(typeof response.body.services.memory.used).toBe('number');
      expect(typeof response.body.services.memory.total).toBe('number');
      expect(typeof response.body.services.memory.percentage).toBe('number');
    });
  });

  describe('/health/ready (GET)', () => {
    it('should return ready status when application is healthy', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('status', 'ready');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('/health/live (GET)', () => {
    it('should return alive status', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
