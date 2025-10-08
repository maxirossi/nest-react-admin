import { ValueObjectBase } from '../base/value-object.base';
import { ValidationException } from '../exceptions/validation-exception';

export class Password extends ValueObjectBase {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.length === 0) {
      throw new ValidationException('Password cannot be empty');
    }

    if (value.length < 6) {
      throw new ValidationException('Password must be at least 6 characters long');
    }

    if (value.length > 100) {
      throw new ValidationException('Password must be at most 100 characters long');
    }
  }

  toString(): string {
    return '[REDACTED]';
  }
}
