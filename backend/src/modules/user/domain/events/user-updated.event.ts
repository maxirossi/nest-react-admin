import { DomainEvent } from '../../../../shared/domain/events/domain-event';
import { v4 as uuidv4 } from 'uuid';

export class UserUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly fullName: string,
  ) {
    super(uuidv4());
  }

  getEventName(): string {
    return 'user.updated';
  }
}
