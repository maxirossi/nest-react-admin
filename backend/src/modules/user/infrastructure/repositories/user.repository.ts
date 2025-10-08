import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILike } from 'typeorm';

import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { IUserRepository, UserFilters } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository
  extends BaseRepository<User, UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
    protected readonly mapper: UserMapper,
  ) {
    super(repository, mapper);
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { username } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.repository.count({ where: { username } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findAllWithFilters(filters: UserFilters): Promise<User[]> {
    const where: any = {};

    if (filters.firstName) {
      where.firstName = ILike(`%${filters.firstName}%`);
    }

    if (filters.lastName) {
      where.lastName = ILike(`%${filters.lastName}%`);
    }

    if (filters.username) {
      where.username = ILike(`%${filters.username}%`);
    }

    if (filters.role) {
      where.role = filters.role;
    }

    const entities = await this.repository.find({
      where,
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });

    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
