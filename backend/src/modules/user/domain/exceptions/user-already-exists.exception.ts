import { DuplicateException } from '../../../../shared/domain/exceptions/duplicate-exception';

export class UserAlreadyExistsException extends DuplicateException {
  constructor(username: string) {
    super('User', 'username', username);
  }
}
