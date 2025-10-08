import { Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/domain/interfaces/use-case.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserFullName } from '../../domain/value-objects/user-full-name';
import { Username } from '../../../../shared/domain/value-objects/username';
import { Password } from '../../../../shared/domain/value-objects/password';
import { UserRole } from '../../domain/value-objects/user-role';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserDto, UserResponseDto>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(request: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByUsername(
      request.username,
    );
    if (existingUser) {
      throw new UserAlreadyExistsException(request.username);
    }

    // Create value objects
    const fullName = new UserFullName(request.firstName, request.lastName);
    const username = new Username(request.username);
    const password = new Password(request.password);
    const role = new UserRole(request.role);

    // Hash password
    const hashedPassword = await this.userDomainService.hashPassword(password);

    // Create user entity
    const user = User.create({
      fullName,
      username,
      password: new Password(hashedPassword),
      role,
      isActive: true,
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Return response
    return new UserResponseDto({
      id: savedUser.id,
      firstName: savedUser.fullName.firstName.value,
      lastName: savedUser.fullName.lastName.value,
      username: savedUser.username.value,
      password: savedUser.password.value,
      role: savedUser.role.value,
      isActive: savedUser.isActive,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  }
}
