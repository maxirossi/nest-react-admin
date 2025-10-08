import { ValueObjectBase } from '../base/value-object.base';
import { ValidationException } from '../exceptions/validation-exception';

export class Name extends ValueObjectBase {
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
      throw new ValidationException('Name cannot be empty');
    }

    if (value.length < 2) {
      throw new ValidationException('Name must be at least 2 characters long');
    }

    if (value.length > 100) {
      throw new ValidationException('Name must be at most 100 characters long');
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(value)) {
      throw new ValidationException('Name can only contain letters and spaces');
    }
  }

  toString(): string {
    return this._value;
  }
}
