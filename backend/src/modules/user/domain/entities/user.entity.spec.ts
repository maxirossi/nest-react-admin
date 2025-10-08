import { User } from './user.entity';
import { UserFullName } from '../value-objects/user-full-name';
import { Username } from '../../../../shared/domain/value-objects/username';
import { Password } from '../../../../shared/domain/value-objects/password';
import { UserRole, UserRoleEnum } from '../value-objects/user-role';

describe('User Entity', () => {
  let user: User;
  let fullName: UserFullName;
  let username: Username;
  let password: Password;
  let role: UserRole;

  beforeEach(() => {
    fullName = new UserFullName('John', 'Doe');
    username = new Username('johndoe');
    password = new Password('password123');
    role = new UserRole(UserRoleEnum.USER);
  });

  describe('create', () => {
    it('should create a new user with all required properties', () => {
      // Act
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });

      // Assert
      expect(user.id).toBeDefined();
      expect(user.fullName).toBe(fullName);
      expect(user.username).toBe(username);
      expect(user.password).toBe(password);
      expect(user.role).toBe(role);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      expect(user.domainEvents).toHaveLength(1);
    });

    it('should generate domain events when creating user', () => {
      // Act
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });

      // Assert
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.created');
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute user from existing data', () => {
      // Arrange
      const id = 'test-id';
      const createdAt = new Date();
      const updatedAt = new Date();

      // Act
      user = User.reconstitute({
        id,
        fullName,
        username,
        password,
        role,
        isActive: true,
        createdAt,
        updatedAt,
      });

      // Assert
      expect(user.id).toBe(id);
      expect(user.fullName).toBe(fullName);
      expect(user.username).toBe(username);
      expect(user.password).toBe(password);
      expect(user.role).toBe(role);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
      expect(user.domainEvents).toHaveLength(0);
    });
  });

  describe('updateProfile', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });
      user.clearDomainEvents(); // Clear creation event
    });

    it('should update user profile and generate domain event', () => {
      // Arrange
      const newFullName = new UserFullName('Jane', 'Smith');
      const newUsername = new Username('janesmith');

      // Act
      user.updateProfile(newFullName, newUsername);

      // Assert
      expect(user.fullName).toBe(newFullName);
      expect(user.username).toBe(newUsername);
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.updated');
    });
  });

  describe('changePassword', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });
      user.clearDomainEvents(); // Clear creation event
    });

    it('should change password and generate domain event', () => {
      // Arrange
      const newPassword = new Password('newpassword123');

      // Act
      user.changePassword(newPassword);

      // Assert
      expect(user.password).toBe(newPassword);
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.updated');
    });
  });

  describe('changeRole', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });
      user.clearDomainEvents(); // Clear creation event
    });

    it('should change role and generate domain event', () => {
      // Arrange
      const newRole = new UserRole(UserRoleEnum.ADMIN);

      // Act
      user.changeRole(newRole);

      // Assert
      expect(user.role).toBe(newRole);
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.updated');
    });
  });

  describe('activate', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: false,
      });
      user.clearDomainEvents(); // Clear creation event
    });

    it('should activate user and generate domain event', () => {
      // Act
      user.activate();

      // Assert
      expect(user.isActive).toBe(true);
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.updated');
    });
  });

  describe('deactivate', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });
      user.clearDomainEvents(); // Clear creation event
    });

    it('should deactivate user and generate domain event', () => {
      // Act
      user.deactivate();

      // Assert
      expect(user.isActive).toBe(false);
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.updated');
    });
  });

  describe('setRefreshToken', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });
    });

    it('should set refresh token', () => {
      // Arrange
      const refreshToken = 'refresh-token-123';

      // Act
      user.setRefreshToken(refreshToken);

      // Assert
      expect(user.refreshToken).toBe(refreshToken);
    });

    it('should clear refresh token when null is passed', () => {
      // Arrange
      user.setRefreshToken('some-token');

      // Act
      user.setRefreshToken(null);

      // Assert
      expect(user.refreshToken).toBeUndefined();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      user = User.create({
        fullName,
        username,
        password,
        role,
        isActive: true,
      });
      user.clearDomainEvents(); // Clear creation event
    });

    it('should generate delete domain event', () => {
      // Act
      user.delete();

      // Assert
      expect(user.domainEvents).toHaveLength(1);
      expect(user.domainEvents[0].getEventName()).toBe('user.deleted');
    });
  });
});
