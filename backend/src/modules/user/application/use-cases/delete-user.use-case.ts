import { Injectable } from '@nestjs/common';

import { UseCase } from '../../../../shared/domain/interfaces/use-case.interface';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable()
export class DeleteUserUseCase implements UseCase<string, string> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<string> {
    // Find user
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    // Mark as deleted (for domain events)
    user.delete();

    // Delete user
    await this.userRepository.delete(id);

    return id;
  }
}
