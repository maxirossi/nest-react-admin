# Refactorización Backend - Domain-Driven Design (DDD)

## Índice
1. [Introducción](#introducción)
2. [Estructura General](#estructura-general)
3. [Shared Module](#shared-module)
4. [Módulo User](#módulo-user)
5. [Beneficios de la Arquitectura](#beneficios-de-la-arquitectura)
6. [Próximos Pasos](#próximos-pasos)

## Introducción

Este documento describe la refactorización del backend aplicando Domain-Driven Design (DDD) con una arquitectura hexagonal (puertos y adaptadores).

### Objetivos de la Refactorización

1. **Separación de responsabilidades**: Dividir la lógica en capas bien definidas
2. **Independencia del framework**: El dominio no depende de NestJS o TypeORM
3. **Testabilidad**: Facilitar la creación de tests unitarios y de integración
4. **Mantenibilidad**: Código más organizado y fácil de mantener
5. **Escalabilidad**: Estructura que permite crecer sin problemas

### Principios Aplicados

- **Separation of Concerns (SoC)**: Cada capa tiene una responsabilidad única
- **Dependency Inversion**: Las capas superiores no dependen de las inferiores
- **Single Responsibility**: Cada clase tiene una sola razón para cambiar
- **Open/Closed**: Abierto para extensión, cerrado para modificación

## Estructura General

```
src/
├── shared/                    # Elementos compartidos entre módulos
│   ├── domain/               # Elementos de dominio compartidos
│   │   ├── base/            # Clases base
│   │   │   ├── entity.base.ts
│   │   │   ├── value-object.base.ts
│   │   │   └── aggregate-root.base.ts
│   │   ├── events/          # Eventos de dominio
│   │   │   ├── domain-event.ts
│   │   │   ├── domain-event-handler.ts
│   │   │   └── domain-event-publisher.ts
│   │   ├── exceptions/      # Excepciones de dominio
│   │   │   ├── domain-exception.ts
│   │   │   ├── validation-exception.ts
│   │   │   ├── not-found-exception.ts
│   │   │   └── duplicate-exception.ts
│   │   ├── interfaces/      # Interfaces compartidas
│   │   │   ├── repository.interface.ts
│   │   │   ├── unit-of-work.interface.ts
│   │   │   ├── domain-service.interface.ts
│   │   │   ├── application-service.interface.ts
│   │   │   ├── use-case.interface.ts
│   │   │   ├── query.interface.ts
│   │   │   ├── command.interface.ts
│   │   │   ├── query-handler.interface.ts
│   │   │   ├── command-handler.interface.ts
│   │   │   ├── event-handler.interface.ts
│   │   │   └── mapper.interface.ts
│   │   └── value-objects/   # Value objects compartidos
│   │       ├── email.ts
│   │       ├── username.ts
│   │       ├── password.ts
│   │       ├── name.ts
│   │       └── description.ts
│   ├── infrastructure/       # Infraestructura compartida
│   │   ├── database/       # Configuración de base de datos
│   │   │   └── base.repository.ts
│   │   ├── events/         # Sistema de eventos
│   │   │   └── domain-event-publisher.impl.ts
│   │   ├── filters/        # Filtros de excepciones
│   │   │   └── domain-exception.filter.ts
│   │   ├── interceptors/   # Interceptores
│   │   │   └── logging.interceptor.ts
│   │   └── pipes/          # Pipes
│   │       └── validation.pipe.ts
│   ├── application/        # Aplicación compartida
│   │   └── dto/            # DTOs compartidos
│   │       ├── base-response.dto.ts
│   │       ├── paginated-response.dto.ts
│   │       └── pagination-query.dto.ts
│   └── shared.module.ts    # Módulo compartido
└── modules/                  # Módulos de dominio
    └── user/               # Módulo de usuario
        ├── domain/         # Capa de dominio
        │   ├── entities/   # Entidades de dominio
        │   │   └── user.entity.ts
        │   ├── value-objects/ # Value objects
        │   │   ├── user-full-name.ts
        │   │   └── user-role.ts
        │   ├── events/     # Eventos de dominio
        │   │   ├── user-created.event.ts
        │   │   ├── user-updated.event.ts
        │   │   └── user-deleted.event.ts
        │   ├── exceptions/ # Excepciones de dominio
        │   │   ├── user-already-exists.exception.ts
        │   │   ├── invalid-credentials.exception.ts
        │   │   ├── user-not-found.exception.ts
        │   │   └── user-inactive.exception.ts
        │   ├── interfaces/ # Interfaces de dominio
        │   │   └── user.repository.interface.ts
        │   └── services/   # Servicios de dominio
        │       └── user-domain.service.ts
        ├── application/    # Capa de aplicación
        │   ├── dto/        # DTOs de aplicación
        │   │   ├── create-user.dto.ts
        │   │   ├── update-user.dto.ts
        │   │   ├── user-response.dto.ts
        │   │   └── user-query.dto.ts
        │   └── use-cases/  # Casos de uso
        │       ├── create-user.use-case.ts
        │       ├── update-user.use-case.ts
        │       ├── delete-user.use-case.ts
        │       ├── get-user.use-case.ts
        │       └── get-users.use-case.ts
        ├── infrastructure/ # Capa de infraestructura
        │   ├── entities/   # Entidades de persistencia
        │   │   └── user.entity.ts
        │   ├── mappers/    # Mappers
        │   │   └── user.mapper.ts
        │   └── repositories/ # Repositorios
        │       └── user.repository.ts
        ├── presentation/   # Capa de presentación
        │   └── controllers/ # Controladores
        │       └── user.controller.ts
        └── user.module.ts  # Módulo de usuario
```

## Shared Module

El módulo compartido contiene todos los elementos reutilizables entre módulos.

### Domain

#### Base Classes

##### EntityBase
```typescript
export abstract class EntityBase {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected readonly _updatedAt: Date;

  get id(): string {
    return this._id;
  }

  equals(entity: EntityBase): boolean {
    return this._id === entity._id;
  }
}
```

##### ValueObjectBase
```typescript
export abstract class ValueObjectBase {
  equals(valueObject: ValueObjectBase): boolean {
    return JSON.stringify(this) === JSON.stringify(valueObject);
  }
}
```

##### AggregateRootBase
```typescript
export abstract class AggregateRootBase extends EntityBase {
  private readonly _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}
```

#### Domain Events

Los eventos de dominio permiten desacoplar acciones que ocurren cuando cambia el estado del dominio.

```typescript
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventId: string;

  abstract getEventName(): string;
}
```

#### Domain Exceptions

Excepciones personalizadas para el dominio:

- `DomainException`: Excepción base
- `ValidationException`: Errores de validación
- `NotFoundException`: Entidad no encontrada
- `DuplicateException`: Entidad duplicada

#### Value Objects

Value objects compartidos:

- `Email`: Valida y encapsula emails
- `Username`: Valida y encapsula usernames
- `Password`: Valida y encapsula passwords
- `Name`: Valida y encapsula nombres
- `Description`: Valida y encapsula descripciones

#### Interfaces

Interfaces para los contratos entre capas:

- `Repository<T>`: Contrato para repositorios
- `UnitOfWork`: Contrato para transacciones
- `DomainService`: Marcador para servicios de dominio
- `ApplicationService`: Marcador para servicios de aplicación
- `UseCase<TRequest, TResponse>`: Contrato para casos de uso
- `Query<TRequest, TResponse>`: Contrato para queries
- `Command<TRequest, TResponse>`: Contrato para comandos
- `Mapper<TDomain, TPersistence>`: Contrato para mappers

### Infrastructure

#### Base Repository

Implementación base para repositorios:

```typescript
export abstract class BaseRepository<TDomain extends EntityBase, TPersistence>
  implements Repository<TDomain>
{
  constructor(
    protected readonly repository: TypeOrmRepository<TPersistence>,
    protected readonly mapper: Mapper<TDomain, TPersistence>,
  ) {}

  async findById(id: string): Promise<TDomain | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async save(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const saved = await this.repository.save(persistence as any);
    return this.mapper.toDomain(saved);
  }
}
```

#### Domain Exception Filter

Filtro para manejar excepciones de dominio:

```typescript
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof DuplicateException) {
      status = HttpStatus.CONFLICT;
    } else if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: exception.code,
      details: exception.details,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Application

DTOs compartidos:

- `BaseResponseDto`: DTO base para respuestas
- `PaginatedResponseDto<T>`: DTO para respuestas paginadas
- `PaginationQueryDto`: DTO para queries de paginación

## Módulo User

El módulo User es el primer módulo refactorizado con la estructura DDD completa.

### Domain Layer

#### Entidad User

```typescript
export class User extends AggregateRootBase {
  private _fullName: UserFullName;
  private _username: Username;
  private _password: Password;
  private _role: UserRole;
  private _isActive: boolean;
  private _refreshToken?: string;

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user = new User({ ...props, id: '', createdAt: new Date(), updatedAt: new Date() });
    user.addDomainEvent(new UserCreatedEvent(...));
    return user;
  }

  updateProfile(fullName: UserFullName, username: Username): void {
    this._fullName = fullName;
    this._username = username;
    this.addDomainEvent(new UserUpdatedEvent(...));
  }

  changePassword(newPassword: Password): void {
    this._password = newPassword;
    this.addDomainEvent(new UserUpdatedEvent(...));
  }
}
```

**Características**:
- Encapsula la lógica de negocio del usuario
- Usa value objects para validación
- Genera eventos de dominio
- No depende de NestJS o TypeORM

#### Value Objects

##### UserFullName
```typescript
export class UserFullName extends ValueObjectBase {
  private readonly _firstName: Name;
  private readonly _lastName: Name;

  get fullName(): string {
    return `${this._firstName.value} ${this._lastName.value}`;
  }
}
```

##### UserRole
```typescript
export enum UserRoleEnum {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export class UserRole extends ValueObjectBase {
  private readonly _value: UserRoleEnum;

  isAdmin(): boolean {
    return this._value === UserRoleEnum.ADMIN;
  }
}
```

#### Domain Events

- `UserCreatedEvent`: Se dispara cuando se crea un usuario
- `UserUpdatedEvent`: Se dispara cuando se actualiza un usuario
- `UserDeletedEvent`: Se dispara cuando se elimina un usuario

#### Domain Service

```typescript
@Injectable()
export class UserDomainService implements DomainService {
  async hashPassword(password: Password): Promise<string> {
    return bcrypt.hash(password.value, 10);
  }

  async validateCredentials(user: User, password: string): Promise<void> {
    const isPasswordValid = await this.comparePasswords(password, user.password.value);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }
    if (!user.isActive) {
      throw new UserInactiveException(user.username.value);
    }
  }
}
```

### Application Layer

#### Use Cases

##### CreateUserUseCase
```typescript
@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, UserResponseDto> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(request: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByUsername(request.username);
    if (existingUser) {
      throw new UserAlreadyExistsException(request.username);
    }

    // Create value objects
    const fullName = new UserFullName(request.firstName, request.lastName);
    const username = new Username(request.username);
    const password = new Password(request.password);
    const role = new UserRole(request.role);

    // Hash password
    const hashedPassword = await this.userDomainService.hashPassword(password);

    // Create user entity
    const user = User.create({
      fullName,
      username,
      password: new Password(hashedPassword),
      role,
      isActive: true,
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Return response
    return new UserResponseDto({ ... });
  }
}
```

**Características**:
- Orquesta las operaciones del dominio
- Valida reglas de negocio
- Usa el repositorio para persistir
- No contiene lógica de negocio (solo orquestación)

#### DTOs

- `CreateUserDto`: DTO para crear usuarios
- `UpdateUserDto`: DTO para actualizar usuarios
- `UserResponseDto`: DTO para respuestas
- `UserQueryDto`: DTO para consultas

### Infrastructure Layer

#### Persistence Entity

```typescript
@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
```

#### Mapper

```typescript
@Injectable()
export class UserMapper implements Mapper<User, UserEntity> {
  toDomain(entity: UserEntity): User {
    return User.reconstitute({
      id: entity.id,
      fullName: new UserFullName(entity.firstName, entity.lastName),
      username: new Username(entity.username),
      password: new Password(entity.password),
      role: new UserRole(entity.role),
      isActive: entity.isActive,
      refreshToken: entity.refreshToken,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.firstName = domain.fullName.firstName.value;
    entity.lastName = domain.fullName.lastName.value;
    entity.username = domain.username.value;
    entity.password = domain.password.value;
    entity.role = domain.role.value;
    entity.isActive = domain.isActive;
    entity.refreshToken = domain.refreshToken;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
```

**Características**:
- Convierte entre dominio y persistencia
- Preserva la encapsulación del dominio
- Permite cambiar la base de datos sin afectar el dominio

#### Repository

```typescript
@Injectable()
export class UserRepository
  extends BaseRepository<User, UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>,
    protected readonly mapper: UserMapper,
  ) {
    super(repository, mapper);
  }

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { username } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findAllWithFilters(filters: UserFilters): Promise<User[]> {
    // Implementación con ILike para búsqueda
    const entities = await this.repository.find({ where, order: {...} });
    return entities.map((entity) => this.mapper.toDomain(entity));
  }
}
```

### Presentation Layer

#### Controller

```typescript
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
}
```

**Características**:
- Delgado, solo delega a los casos de uso
- No contiene lógica de negocio
- Fácil de testear

## Beneficios de la Arquitectura

### 1. Independencia del Framework

El dominio no depende de NestJS ni de TypeORM:
- Fácil migrar a otro framework
- Fácil cambiar de base de datos
- Lógica de negocio protegida

### 2. Testabilidad

Fácil crear tests:
- **Tests unitarios**: Para entidades, value objects, servicios de dominio
- **Tests de integración**: Para casos de uso, repositorios
- **Tests E2E**: Para controladores

### 3. Mantenibilidad

Código más organizado:
- Cada capa tiene una responsabilidad clara
- Fácil encontrar y modificar código
- Cambios aislados a una capa

### 4. Escalabilidad

Arquitectura que permite crecer:
- Fácil agregar nuevos módulos
- Fácil agregar nuevos casos de uso
- Fácil agregar nuevos eventos

### 5. Validación Fuerte

Value objects validan en construcción:
- No hay estados inválidos
- Validación centralizada
- Fácil agregar nuevas validaciones

### 6. Domain Events

Desacoplamiento de operaciones:
- Acciones secundarias no bloquean
- Fácil agregar nuevas acciones
- Auditabilidad

## Próximos Pasos

### Fase 3: Refactorizar Course Module

Aplicar la misma estructura al módulo de Course:
- Domain entities: `Course`
- Value objects: `CourseName`, `CourseDescription`
- Domain events: `CourseCreatedEvent`, `CourseUpdatedEvent`, `CourseDeletedEvent`
- Use cases: `CreateCourseUseCase`, `UpdateCourseUseCase`, etc.

### Fase 4: Refactorizar Content Module

Aplicar la misma estructura al módulo de Content:
- Domain entities: `Content`
- Value objects: `ContentName`, `ContentDescription`
- Domain events: `ContentCreatedEvent`, `ContentUpdatedEvent`, `ContentDeletedEvent`
- Use cases: `CreateContentUseCase`, `UpdateContentUseCase`, etc.

### Fase 5: Refactorizar Auth Module

Aplicar la misma estructura al módulo de Auth:
- Domain entities: Ninguna (usa User)
- Value objects: `RefreshToken`, `AccessToken`
- Domain events: `UserLoggedInEvent`, `UserLoggedOutEvent`
- Use cases: `LoginUseCase`, `LogoutUseCase`, `RefreshTokenUseCase`

### Fase 6: Refactorizar Stats Module

Aplicar la misma estructura al módulo de Stats:
- Domain entities: Ninguna (agrega datos de otros módulos)
- Use cases: `GetStatsUseCase`

### Fase 7: Testing y Documentación

- Agregar tests unitarios para el dominio
- Agregar tests de integración para los casos de uso
- Agregar tests E2E para los controladores
- Documentar la API con Swagger
- Documentar casos de uso con ejemplos

## Conclusiones

La refactorización hacia DDD proporciona:

1. **Código más limpio**: Separación clara de responsabilidades
2. **Mayor testabilidad**: Fácil crear tests en todas las capas
3. **Mejor mantenibilidad**: Cambios aislados a una capa
4. **Escalabilidad**: Fácil agregar nuevos módulos y funcionalidades
5. **Independencia**: No acoplado a frameworks o bases de datos específicas

Esta arquitectura es especialmente útil para proyectos que crecerán en complejidad y que requieren alta calidad de código.
