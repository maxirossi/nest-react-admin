import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DomainEvent } from '../../domain/events/domain-event';
import { DomainEventPublisher } from '../../domain/events/domain-event-publisher';

@Injectable()
export class DomainEventPublisherImpl implements DomainEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: DomainEvent): Promise<void> {
    this.eventEmitter.emit(event.getEventName(), event);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    events.forEach((event) => {
      this.eventEmitter.emit(event.getEventName(), event);
    });
  }
}
