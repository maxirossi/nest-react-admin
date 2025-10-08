import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DomainEventPublisherImpl } from './infrastructure/events/domain-event-publisher.impl';
import { DomainEventPublisher } from './domain/events/domain-event-publisher';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    {
      provide: DomainEventPublisher,
      useClass: DomainEventPublisherImpl,
    },
  ],
  exports: [DomainEventPublisher],
})
export class SharedModule {}
