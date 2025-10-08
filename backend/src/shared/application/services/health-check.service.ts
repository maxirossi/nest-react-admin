import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { HealthCheckDto } from '../dto/health-check.dto';

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getHealthStatus(): Promise<HealthCheckDto> {
    try {
      // Check database connection
      const isDatabaseConnected = await this.checkDatabaseConnection();

      // Get memory usage
      const memoryUsage = process.memoryUsage();
      const totalMemory = memoryUsage.heapTotal;
      const usedMemory = memoryUsage.heapUsed;
      const memoryPercentage = (usedMemory / totalMemory) * 100;

      const services = {
        database: (isDatabaseConnected ? 'connected' : 'disconnected') as 'connected' | 'disconnected',
        memory: {
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: Math.round(memoryPercentage),
        },
      };

      const status = isDatabaseConnected ? 'ok' : 'error';

      return new HealthCheckDto(
        status,
        services,
        process.env.npm_package_version || '1.0.0',
      );
    } catch (error) {
      return new HealthCheckDto(
        'error',
        {
          database: 'disconnected',
          memory: {
            used: 0,
            total: 0,
            percentage: 0,
          },
        },
        process.env.npm_package_version || '1.0.0',
      );
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.connection.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }
}
