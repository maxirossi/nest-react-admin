import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { DomainService } from '../../../../shared/domain/interfaces/domain-service.interface';
import { User } from '../entities/user.entity';
import { Password } from '../../../../shared/domain/value-objects/password';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { UserInactiveException } from '../exceptions/user-inactive.exception';

@Injectable()
export class UserDomainService implements DomainService {
  async hashPassword(password: Password): Promise<string> {
    return bcrypt.hash(password.value, 10);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async validateCredentials(user: User, password: string): Promise<void> {
    const isPasswordValid = await this.comparePasswords(
      password,
      user.password.value,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive) {
      throw new UserInactiveException(user.username.value);
    }
  }

  async hashRefreshToken(refreshToken: string): Promise<string> {
    return bcrypt.hash(refreshToken, 10);
  }

  async compareRefreshTokens(
    plainToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainToken, hashedToken);
  }
}
