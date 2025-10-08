import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { User } from '../../domain/entities/user.entity';
import { UserFullName } from '../../domain/value-objects/user-full-name';
import { Username } from '../../../../shared/domain/value-objects/username';
import { Password } from '../../../../shared/domain/value-objects/password';
import { UserRole, UserRoleEnum } from '../../domain/value-objects/user-role';
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: IUserRepository;
  let userDomainService: UserDomainService;

  const mockUserRepository = {
    findByUsername: jest.fn(),
    save: jest.fn(),
  };

  const mockUserDomainService = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UserDomainService,
          useValue: mockUserDomainService,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<IUserRepository>(IUserRepository);
    userDomainService = module.get<UserDomainService>(UserDomainService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      role: UserRoleEnum.USER,
    };

    it('should create user successfully', async () => {
      // Arrange
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserDomainService.hashPassword.mockResolvedValue('hashed-password');
      
      const savedUser = User.create({
        fullName: new UserFullName('John', 'Doe'),
        username: new Username('johndoe'),
        password: new Password('hashed-password'),
        role: new UserRole(UserRoleEnum.USER),
        isActive: true,
      });
      mockUserRepository.save.mockResolvedValue(savedUser);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.username).toBe('johndoe');
      expect(result.role).toBe(UserRoleEnum.USER);
      expect(result.isActive).toBe(true);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('johndoe');
      expect(mockUserDomainService.hashPassword).toHaveBeenCalledWith(expect.any(Password));
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      // Arrange
      const existingUser = User.create({
        fullName: new UserFullName('Jane', 'Doe'),
        username: new Username('johndoe'),
        password: new Password('password'),
        role: new UserRole(UserRoleEnum.USER),
        isActive: true,
      });
      mockUserRepository.findByUsername.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(UserAlreadyExistsException);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('johndoe');
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      // Arrange
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserDomainService.hashPassword.mockResolvedValue('hashed-password');
      
      const savedUser = User.create({
        fullName: new UserFullName('John', 'Doe'),
        username: new Username('johndoe'),
        password: new Password('hashed-password'),
        role: new UserRole(UserRoleEnum.USER),
        isActive: true,
      });
      mockUserRepository.save.mockResolvedValue(savedUser);

      // Act
      await useCase.execute(createUserDto);

      // Assert
      expect(mockUserDomainService.hashPassword).toHaveBeenCalledWith(expect.any(Password));
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    });
  });
});
