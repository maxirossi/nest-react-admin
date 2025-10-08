import { Repository } from '../../../../shared/domain/interfaces/repository.interface';
import { User } from '../entities/user.entity';

export interface IUserRepository extends Repository<User> {
  findByUsername(username: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
  count(): Promise<number>;
  findAllWithFilters(filters: UserFilters): Promise<User[]>;
}

export interface UserFilters {
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}
