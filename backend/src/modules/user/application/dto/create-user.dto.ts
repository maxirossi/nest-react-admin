import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../domain/value-objects/user-role';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
