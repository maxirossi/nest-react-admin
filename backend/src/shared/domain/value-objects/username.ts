import { ValueObjectBase } from '../base/value-object.base';
import { ValidationException } from '../exceptions/validation-exception';

export class Username extends ValueObjectBase {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this.validate(value);
    this._value = value.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationException('Username cannot be empty');
    }

    if (value.length < 3) {
      throw new ValidationException('Username must be at least 3 characters long');
    }

    if (value.length > 50) {
      throw new ValidationException('Username must be at most 50 characters long');
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) {
      throw new ValidationException('Username can only contain letters, numbers, and underscores');
    }
  }

  toString(): string {
    return this._value;
  }
}
