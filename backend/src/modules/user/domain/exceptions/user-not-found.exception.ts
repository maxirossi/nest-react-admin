import { NotFoundException } from '../../../../shared/domain/exceptions/not-found-exception';

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string) {
    super('User', identifier);
  }
}
