import { DomainException } from './domain-exception';

export class DuplicateException extends DomainException {
  constructor(resource: string, field: string, value: string) {
    super(`${resource} with ${field} ${value} already exists`, 'DUPLICATE', {
      resource,
      field,
      value,
    });
  }
}
