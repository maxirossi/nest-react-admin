import { DomainEvent } from '../events/domain-event';

export interface EventHandler<TEvent extends DomainEvent> {
  handle(event: TEvent): Promise<void>;
}