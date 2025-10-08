import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../domain/value-objects/user-role';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
