import { DomainException } from '../../../../shared/domain/exceptions/domain-exception';

export class UserInactiveException extends DomainException {
  constructor(username: string) {
    super(`User ${username} is inactive`, 'USER_INACTIVE', { username });
  }
}
