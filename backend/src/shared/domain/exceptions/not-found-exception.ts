import { DomainException } from './domain-exception';

export class NotFoundException extends DomainException {
  constructor(resource: string, identifier: string) {
    super(`${resource} with identifier ${identifier} not found`, 'NOT_FOUND', {
      resource,
      identifier,
    });
  }
}
