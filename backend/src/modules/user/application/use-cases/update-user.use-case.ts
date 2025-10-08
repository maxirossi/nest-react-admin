import { Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/domain/interfaces/use-case.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserFullName } from '../../domain/value-objects/user-full-name';
import { Username } from '../../../../shared/domain/value-objects/username';
import { Password } from '../../../../shared/domain/value-objects/password';
import { UserRole } from '../../domain/value-objects/user-role';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export interface UpdateUserRequest {
  id: string;
  dto: UpdateUserDto;
}

@Injectable()
export class UpdateUserUseCase
  implements UseCase<UpdateUserRequest, UserResponseDto>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(request: UpdateUserRequest): Promise<UserResponseDto> {
    const { id, dto } = request;

    // Find user
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    // Update profile if firstName or lastName is provided
    if (dto.firstName || dto.lastName) {
      const fullName = new UserFullName(
        dto.firstName || user.fullName.firstName.value,
        dto.lastName || user.fullName.lastName.value,
      );
      const username = dto.username
        ? new Username(dto.username)
        : user.username;

      // Check if username is being changed and if it already exists
      if (dto.username && dto.username !== user.username.value) {
        const existingUser = await this.userRepository.findByUsername(
          dto.username,
        );
        if (existingUser) {
          throw new UserAlreadyExistsException(dto.username);
        }
      }

      user.updateProfile(fullName, username);
    }

    // Update password if provided
    if (dto.password) {
      const password = new Password(dto.password);
      const hashedPassword = await this.userDomainService.hashPassword(
        password,
      );
      user.changePassword(new Password(hashedPassword));
    }

    // Update role if provided
    if (dto.role) {
      const role = new UserRole(dto.role);
      user.changeRole(role);
    }

    // Update active status if provided
    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    // Save user
    const updatedUser = await this.userRepository.update(user);

    // Return response
    return new UserResponseDto({
      id: updatedUser.id,
      firstName: updatedUser.fullName.firstName.value,
      lastName: updatedUser.fullName.lastName.value,
      username: updatedUser.username.value,
      password: updatedUser.password.value,
      role: updatedUser.role.value,
      isActive: updatedUser.isActive,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }
}
