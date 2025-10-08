import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { StatsResponseDto } from './stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
@ApiTags('Stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get application statistics',
    description: 'Retrieve application statistics including total users, courses, and contents.'
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: StatsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getStats(): Promise<StatsResponseDto> {
    return await this.statsService.getStats();
  }
}
