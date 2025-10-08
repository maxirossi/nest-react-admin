import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../../../../auth/guards/jwt.guard';
import { RolesGuard } from '../../../../auth/guards/roles.guard';
import { UserGuard } from '../../../../auth/guards/user.guard';
import { Roles } from '../../../../decorators/roles.decorator';
import { Role } from '../../../../enums/role.enum';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { UserQueryDto } from '../../application/dto/user-query.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Admin)
  async save(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(@Query() userQuery: UserQueryDto): Promise<UserResponseDto[]> {
    return this.getUsersUseCase.execute(userQuery);
  }

  @Get('/:id')
  @UseGuards(UserGuard)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.getUserUseCase.execute(id);
  }

  @Put('/:id')
  @UseGuards(UserGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute({ id, dto: updateUserDto });
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return this.deleteUserUseCase.execute(id);
  }
}
