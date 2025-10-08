export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  constructor(eventId: string, occurredOn: Date = new Date()) {
    this.eventId = eventId;
    this.occurredOn = occurredOn;
  }

  abstract getEventName(): string;
}
