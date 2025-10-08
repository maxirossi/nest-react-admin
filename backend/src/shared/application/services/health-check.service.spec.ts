import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';

import { HealthCheckService } from './health-check.service';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let connection: Connection;

  const mockConnection = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        {
          provide: Connection,
          useValue: mockConnection,
        },
      ],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
    connection = module.get<Connection>(Connection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealthStatus', () => {
    it('should return healthy status when database is connected', async () => {
      // Arrange
      mockConnection.query.mockResolvedValue([{ '?column?': 1 }]);
      const originalMemoryUsage = process.memoryUsage;
      process.memoryUsage = jest.fn().mockReturnValue({
        heapTotal: 100 * 1024 * 1024, // 100MB
        heapUsed: 50 * 1024 * 1024, // 50MB
        external: 0,
        rss: 0,
        arrayBuffers: 0,
      });

      // Act
      const result = await service.getHealthStatus();

      // Assert
      expect(result.status).toBe('ok');
      expect(result.services.database).toBe('connected');
      expect(result.services.memory.used).toBe(50);
      expect(result.services.memory.total).toBe(100);
      expect(result.services.memory.percentage).toBe(50);
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeDefined();
      expect(result.version).toBeDefined();

      // Cleanup
      process.memoryUsage = originalMemoryUsage;
    });

    it('should return error status when database is disconnected', async () => {
      // Arrange
      mockConnection.query.mockRejectedValue(new Error('Connection failed'));

      // Act
      const result = await service.getHealthStatus();

      // Assert
      expect(result.status).toBe('error');
      expect(result.services.database).toBe('disconnected');
    });

    it('should handle database connection errors gracefully', async () => {
      // Arrange
      mockConnection.query.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await service.getHealthStatus();

      // Assert
      expect(result.status).toBe('error');
      expect(result.services.database).toBe('disconnected');
    });
  });

  describe('checkDatabaseConnection', () => {
    it('should return true when database query succeeds', async () => {
      // Arrange
      mockConnection.query.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      const result = await (service as any).checkDatabaseConnection();

      // Assert
      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledWith('SELECT 1');
    });

    it('should return false when database query fails', async () => {
      // Arrange
      mockConnection.query.mockRejectedValue(new Error('Connection failed'));

      // Act
      const result = await (service as any).checkDatabaseConnection();

      // Assert
      expect(result).toBe(false);
    });
  });
});
