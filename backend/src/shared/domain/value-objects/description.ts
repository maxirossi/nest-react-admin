import { ValueObjectBase } from '../base/value-object.base';
import { ValidationException } from '../exceptions/validation-exception';

export class Description extends ValueObjectBase {
  private readonly _value: string;

  constructor(value: string) {
    super();
    this.validate(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationException('Description cannot be empty');
    }

    if (value.length < 10) {
      throw new ValidationException('Description must be at least 10 characters long');
    }

    if (value.length > 500) {
      throw new ValidationException('Description must be at most 500 characters long');
    }
  }

  toString(): string {
    return this._value;
  }
}
