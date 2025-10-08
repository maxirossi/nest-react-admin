import { EntityBase } from '../base/entity.base';

export interface Repository<T extends EntityBase> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
