import { ValueObjectBase } from '../base/value-object.base';
import { ValidationException } from '../exceptions/validation-exception';

export class Email extends ValueObjectBase {
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
      throw new ValidationException('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new ValidationException('Invalid email format');
    }
  }

  toString(): string {
    return this._value;
  }
}
