import { Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/domain/interfaces/use-case.interface';
import { IUserRepository, UserFilters } from '../../domain/interfaces/user.repository.interface';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserQueryDto } from '../dto/user-query.dto';

@Injectable()
export class GetUsersUseCase
  implements UseCase<UserQueryDto, UserResponseDto[]>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: UserQueryDto): Promise<UserResponseDto[]> {
    // Create filters
    const filters: UserFilters = {
      firstName: query.firstName,
      lastName: query.lastName,
      username: query.username,
      role: query.role,
    };

    // Find users
    const users = await this.userRepository.findAllWithFilters(filters);

    // Return response
    return users.map(
      (user) =>
        new UserResponseDto({
          id: user.id,
          firstName: user.fullName.firstName.value,
          lastName: user.fullName.lastName.value,
          username: user.username.value,
          password: user.password.value,
          role: user.role.value,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
    );
  }
}
