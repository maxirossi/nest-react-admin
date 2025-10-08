import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository } from './user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../domain/entities/user.entity';
import { UserFullName } from '../../domain/value-objects/user-full-name';
import { Username } from '../../../../shared/domain/value-objects/username';
import { Password } from '../../../../shared/domain/value-objects/password';
import { UserRole, UserRoleEnum } from '../../domain/value-objects/user-role';

describe('UserRepository', () => {
  let repository: UserRepository;
  let typeOrmRepository: Repository<UserEntity>;
  let mapper: UserMapper;

  const mockTypeOrmRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockMapper = {
    toDomain: jest.fn(),
    toPersistence: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockTypeOrmRepository,
        },
        {
          provide: UserMapper,
          useValue: mockMapper,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    typeOrmRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    mapper = module.get<UserMapper>(UserMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'test-id';
      const userEntity = new UserEntity();
      userEntity.id = userId;
      userEntity.firstName = 'John';
      userEntity.lastName = 'Doe';
      userEntity.username = 'johndoe';
      userEntity.password = 'hashed-password';
      userEntity.role = UserRoleEnum.USER;
      userEntity.isActive = true;
      userEntity.createdAt = new Date();
      userEntity.updatedAt = new Date();

      const userDomain = User.create({
        fullName: new UserFullName('John', 'Doe'),
        username: new Username('johndoe'),
        password: new Password('hashed-password'),
        role: new UserRole(UserRoleEnum.USER),
        isActive: true,
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(userEntity);
      mockMapper.toDomain.mockReturnValue(userDomain);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(result).toBe(userDomain);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockMapper.toDomain).toHaveBeenCalledWith(userEntity);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 'test-id';
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(result).toBeNull();
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockMapper.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findByUsername', () => {
    it('should return user when found by username', async () => {
      // Arrange
      const username = 'johndoe';
      const userEntity = new UserEntity();
      userEntity.id = 'test-id';
      userEntity.username = username;

      const userDomain = User.create({
        fullName: new UserFullName('John', 'Doe'),
        username: new Username(username),
        password: new Password('hashed-password'),
        role: new UserRole(UserRoleEnum.USER),
        isActive: true,
      });

      mockTypeOrmRepository.findOne.mockResolvedValue(userEntity);
      mockMapper.toDomain.mockReturnValue(userDomain);

      // Act
      const result = await repository.findByUsername(username);

      // Assert
      expect(result).toBe(userDomain);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(mockMapper.toDomain).toHaveBeenCalledWith(userEntity);
    });

    it('should return null when user not found by username', async () => {
      // Arrange
      const username = 'johndoe';
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByUsername(username);

      // Assert
      expect(result).toBeNull();
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { username } });
      expect(mockMapper.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save user and return domain object', async () => {
      // Arrange
      const userDomain = User.create({
        fullName: new UserFullName('John', 'Doe'),
        username: new Username('johndoe'),
        password: new Password('hashed-password'),
        role: new UserRole(UserRoleEnum.USER),
        isActive: true,
      });

      const userEntity = new UserEntity();
      userEntity.id = 'test-id';
      userEntity.firstName = 'John';
      userEntity.lastName = 'Doe';
      userEntity.username = 'johndoe';
      userEntity.password = 'hashed-password';
      userEntity.role = UserRoleEnum.USER;
      userEntity.isActive = true;

      mockMapper.toPersistence.mockReturnValue(userEntity);
      mockTypeOrmRepository.save.mockResolvedValue(userEntity);
      mockMapper.toDomain.mockReturnValue(userDomain);

      // Act
      const result = await repository.save(userDomain);

      // Assert
      expect(result).toBe(userDomain);
      expect(mockMapper.toPersistence).toHaveBeenCalledWith(userDomain);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(userEntity);
      expect(mockMapper.toDomain).toHaveBeenCalledWith(userEntity);
    });
  });

  describe('delete', () => {
    it('should delete user by id', async () => {
      // Arrange
      const userId = 'test-id';
      mockTypeOrmRepository.delete.mockResolvedValue({ affected: 1 });

      // Act
      await repository.delete(userId);

      // Assert
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith(userId);
    });
  });

  describe('count', () => {
    it('should return user count', async () => {
      // Arrange
      const count = 5;
      mockTypeOrmRepository.count.mockResolvedValue(count);

      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(count);
      expect(mockTypeOrmRepository.count).toHaveBeenCalled();
    });
  });

  describe('findAllWithFilters', () => {
    it('should return filtered users', async () => {
      // Arrange
      const filters = {
        firstName: 'John',
        role: UserRoleEnum.USER,
      };

      const userEntities = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          password: 'hashed-password',
          role: UserRoleEnum.USER,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const userDomains = [
        User.create({
          fullName: new UserFullName('John', 'Doe'),
          username: new Username('johndoe'),
          password: new Password('hashed-password'),
          role: new UserRole(UserRoleEnum.USER),
          isActive: true,
        }),
      ];

      mockTypeOrmRepository.find.mockResolvedValue(userEntities);
      mockMapper.toDomain.mockReturnValue(userDomains[0]);

      // Act
      const result = await repository.findAllWithFilters(filters);

      // Assert
      expect(result).toHaveLength(1);
      expect(mockTypeOrmRepository.find).toHaveBeenCalledWith({
        where: {
          firstName: expect.any(Object), // ILike object
          role: UserRoleEnum.USER,
        },
        order: {
          firstName: 'ASC',
          lastName: 'ASC',
        },
      });
      expect(mockMapper.toDomain).toHaveBeenCalledWith(userEntities[0]);
    });
  });
});
