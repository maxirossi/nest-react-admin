import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { HealthCheckDto } from '../../application/dto/health-check.dto';
import { HealthCheckService } from '../../application/services/health-check.service';

@Controller('health')
@ApiTags('Health Check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: 200,
    description: 'Health status retrieved successfully',
    type: HealthCheckDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable',
    type: HealthCheckDto,
  })
  async getHealth(): Promise<HealthCheckDto> {
    return this.healthCheckService.getHealthStatus();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Check if application is ready to receive traffic' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
  })
  @ApiResponse({
    status: 503,
    description: 'Application is not ready',
  })
  async getReadiness(): Promise<{ status: string; timestamp: string }> {
    const health = await this.healthCheckService.getHealthStatus();
    
    if (health.status === 'ok' && health.services.database === 'connected') {
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    }
    
    throw new Error('Application is not ready');
  }

  @Get('live')
  @ApiOperation({ summary: 'Check if application is alive' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
  })
  async getLiveness(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
