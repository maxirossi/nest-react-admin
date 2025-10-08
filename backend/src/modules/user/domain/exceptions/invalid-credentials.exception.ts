import { DomainException } from '../../../../shared/domain/exceptions/domain-exception';

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid username or password', 'INVALID_CREDENTIALS');
  }
}
