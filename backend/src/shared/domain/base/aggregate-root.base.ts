import { EntityBase } from './entity.base';
import { DomainEvent } from '../events/domain-event';

export abstract class AggregateRootBase extends EntityBase {
  private readonly _domainEvents: DomainEvent[] = [];

  constructor(id: string, createdAt: Date, updatedAt: Date) {
    super(id, createdAt, updatedAt);
  }

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  protected removeDomainEvent(event: DomainEvent): void {
    const index = this._domainEvents.indexOf(event);
    if (index > -1) {
      this._domainEvents.splice(index, 1);
    }
  }

  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}
