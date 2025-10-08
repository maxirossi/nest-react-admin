import { Exclude } from 'class-transformer';
import { UserRoleEnum } from '../../domain/value-objects/user-role';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  username: string;

  @Exclude()
  password: string;

  role: UserRoleEnum;

  @Exclude()
  refreshToken?: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
