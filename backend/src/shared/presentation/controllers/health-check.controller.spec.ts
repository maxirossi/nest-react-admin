import { Test, TestingModule } from '@nestjs/testing';

import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from '../../application/services/health-check.service';
import { HealthCheckDto } from '../../application/dto/health-check.dto';

describe('HealthCheckController', () => {
  let controller: HealthCheckController;
  let healthCheckService: HealthCheckService;

  const mockHealthCheckService = {
    getHealthStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
      ],
    }).compile();

    controller = module.get<HealthCheckController>(HealthCheckController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      // Arrange
      const mockHealthStatus = new HealthCheckDto(
        'ok',
        {
          database: 'connected',
          memory: {
            used: 50,
            total: 100,
            percentage: 50,
          },
        },
        '1.0.0',
      );
      mockHealthCheckService.getHealthStatus.mockResolvedValue(mockHealthStatus);

      // Act
      const result = await controller.getHealth();

      // Assert
      expect(result).toEqual(mockHealthStatus);
      expect(healthCheckService.getHealthStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('getReadiness', () => {
    it('should return ready status when application is healthy', async () => {
      // Arrange
      const mockHealthStatus = new HealthCheckDto(
        'ok',
        {
          database: 'connected',
          memory: {
            used: 50,
            total: 100,
            percentage: 50,
          },
        },
        '1.0.0',
      );
      mockHealthCheckService.getHealthStatus.mockResolvedValue(mockHealthStatus);

      // Act
      const result = await controller.getReadiness();

      // Assert
      expect(result.status).toBe('ready');
      expect(result.timestamp).toBeDefined();
    });

    it('should throw error when application is not ready', async () => {
      // Arrange
      const mockHealthStatus = new HealthCheckDto(
        'error',
        {
          database: 'disconnected',
          memory: {
            used: 0,
            total: 0,
            percentage: 0,
          },
        },
        '1.0.0',
      );
      mockHealthCheckService.getHealthStatus.mockResolvedValue(mockHealthStatus);

      // Act & Assert
      await expect(controller.getReadiness()).rejects.toThrow('Application is not ready');
    });
  });

  describe('getLiveness', () => {
    it('should return alive status', async () => {
      // Act
      const result = await controller.getLiveness();

      // Assert
      expect(result.status).toBe('alive');
      expect(result.timestamp).toBeDefined();
    });
  });
});
