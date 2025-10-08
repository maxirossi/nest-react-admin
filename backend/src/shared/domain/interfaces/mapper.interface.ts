import { EntityBase } from '../base/entity.base';

export interface Mapper<TDomain extends EntityBase, TPersistence> {
  toDomain(entity: TPersistence): TDomain;
  toPersistence(domain: TDomain): TPersistence;
}
