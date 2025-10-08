import { IsOptional, IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';
import { UserRoleEnum } from '../../domain/value-objects/user-role';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
