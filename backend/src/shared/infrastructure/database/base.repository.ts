import { Repository as TypeOrmRepository } from 'typeorm';

import { EntityBase } from '../../domain/base/entity.base';
import { Repository } from '../../domain/interfaces/repository.interface';
import { Mapper } from '../../domain/interfaces/mapper.interface';

export abstract class BaseRepository<
  TDomain extends EntityBase,
  TPersistence,
> implements Repository<TDomain>
{
  constructor(
    protected readonly repository: TypeOrmRepository<TPersistence>,
    protected readonly mapper: Mapper<TDomain, TPersistence>,
  ) {}

  async findById(id: string): Promise<TDomain | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAll(): Promise<TDomain[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.mapper.toDomain(entity));
  }

  async save(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const saved = await this.repository.save(persistence as any);
    return this.mapper.toDomain(saved);
  }

  async update(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    await this.repository.save(persistence as any);
    return entity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } as any });
    return count > 0;
  }
}
