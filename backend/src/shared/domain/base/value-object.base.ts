export abstract class ValueObjectBase {
  equals(valueObject: ValueObjectBase): boolean {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }

    if (this === valueObject) {
      return true;
    }

    return JSON.stringify(this) === JSON.stringify(valueObject);
  }

  toString(): string {
    return JSON.stringify(this);
  }
}
