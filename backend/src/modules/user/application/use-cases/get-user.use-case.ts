import { Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/domain/interfaces/use-case.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GetUserUseCase implements UseCase<string, UserResponseDto> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDto> {
    // Find user
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    // Return response
    return new UserResponseDto({
      id: user.id,
      firstName: user.fullName.firstName.value,
      lastName: user.fullName.lastName.value,
      username: user.username.value,
      password: user.password.value,
      role: user.role.value,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
