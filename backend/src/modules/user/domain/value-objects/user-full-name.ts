import { ValueObjectBase } from '../../../../shared/domain/base/value-object.base';
import { Name } from '../../../../shared/domain/value-objects/name';

export class UserFullName extends ValueObjectBase {
  private readonly _firstName: Name;
  private readonly _lastName: Name;

  constructor(firstName: string, lastName: string) {
    super();
    this._firstName = new Name(firstName);
    this._lastName = new Name(lastName);
  }

  get firstName(): Name {
    return this._firstName;
  }

  get lastName(): Name {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName.value} ${this._lastName.value}`;
  }

  toString(): string {
    return this.fullName;
  }
}
