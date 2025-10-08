export class HealthCheckDto {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  version: string;

  constructor(
    status: 'ok' | 'error',
    services: {
      database: 'connected' | 'disconnected';
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
    },
    version: string,
  ) {
    this.status = status;
    this.timestamp = new Date().toISOString();
    this.uptime = process.uptime();
    this.services = services;
    this.version = version;
  }
}
