import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DomainEventPublisherImpl } from './infrastructure/events/domain-event-publisher.impl';
import { DomainEventPublisher } from './domain/events/domain-event-publisher';
import { HealthCheckService } from './application/services/health-check.service';
import { HealthCheckController } from './presentation/controllers/health-check.controller';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [HealthCheckController],
  providers: [
    {
      provide: DomainEventPublisher,
      useClass: DomainEventPublisherImpl,
    },
    HealthCheckService,
  ],
  exports: [DomainEventPublisher, HealthCheckService],
})
export class SharedModule {}
