import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CourseModule } from './course/course.module';
import { StatsModule } from './stats/stats.module';
import { UserModule as UserModuleOld } from './user/user.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    SharedModule,
    UserModule,
    // Old modules (to be refactored)
    // UserModuleOld,
    AuthModule,
    CourseModule,
    ContentModule,
    StatsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
