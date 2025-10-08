import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './infrastructure/entities/user.entity';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDomainService } from './domain/services/user-domain.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { IUserRepository } from './domain/interfaces/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserMapper,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    UserDomainService,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserUseCase,
    GetUsersUseCase,
  ],
  exports: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    UserDomainService,
  ],
})
export class UserModule {}
