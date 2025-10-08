import { ValueObjectBase } from '../../../../shared/domain/base/value-object.base';
import { ValidationException } from '../../../../shared/domain/exceptions/validation-exception';

export enum UserRoleEnum {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export class UserRole extends ValueObjectBase {
  private readonly _value: UserRoleEnum;

  constructor(value: string) {
    super();
    this.validate(value);
    this._value = value as UserRoleEnum;
  }

  get value(): UserRoleEnum {
    return this._value;
  }

  private validate(value: string): void {
    if (!Object.values(UserRoleEnum).includes(value as UserRoleEnum)) {
      throw new ValidationException('Invalid user role');
    }
  }

  isAdmin(): boolean {
    return this._value === UserRoleEnum.ADMIN;
  }

  isEditor(): boolean {
    return this._value === UserRoleEnum.EDITOR;
  }

  isUser(): boolean {
    return this._value === UserRoleEnum.USER;
  }

  toString(): string {
    return this._value;
  }
}
