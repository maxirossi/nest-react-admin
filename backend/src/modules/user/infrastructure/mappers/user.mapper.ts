import { Injectable } from '@nestjs/common';

import { Mapper } from '../../../../shared/domain/interfaces/mapper.interface';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';
import { UserFullName } from '../../domain/value-objects/user-full-name';
import { Username } from '../../../../shared/domain/value-objects/username';
import { Password } from '../../../../shared/domain/value-objects/password';
import { UserRole } from '../../domain/value-objects/user-role';

@Injectable()
export class UserMapper implements Mapper<User, UserEntity> {
  toDomain(entity: UserEntity): User {
    return User.reconstitute({
      id: entity.id,
      fullName: new UserFullName(entity.firstName, entity.lastName),
      username: new Username(entity.username),
      password: new Password(entity.password),
      role: new UserRole(entity.role),
      isActive: entity.isActive,
      refreshToken: entity.refreshToken,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.firstName = domain.fullName.firstName.value;
    entity.lastName = domain.fullName.lastName.value;
    entity.username = domain.username.value;
    entity.password = domain.password.value;
    entity.role = domain.role.value;
    entity.isActive = domain.isActive;
    entity.refreshToken = domain.refreshToken;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
