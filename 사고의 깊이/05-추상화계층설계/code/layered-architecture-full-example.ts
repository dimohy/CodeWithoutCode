// Chapter 5: 레이어드 아키텍처 - 4계층 구조 전체 예시

// ============= Presentation Layer (표현 계층) =============
// HTTP 요청/응답, 입력 검증

interface Request {
    body: any;
}

interface Response {
    status(code: number): Response;
    json(data: any): void;
}

interface CreateUserCommand {
    name: string;
    email: string;
    password: string;
}

interface CreateUserResult {
    userId: string;
}

class UserController {
    constructor(
        private createUserUseCase: CreateUserUseCase
    ) { }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const command: CreateUserCommand = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            };

            const result = await this.createUserUseCase.execute(command);

            res.status(201).json({
                id: result.userId,
                message: 'User created successfully'
            });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}

// ============= Application Layer (애플리케이션 계층) =============
// 비즈니스 플로우 조정, 트랜잭션 관리

interface EmailService {
    sendWelcomeEmail(email: string): Promise<void>;
}

interface EventPublisher {
    publish(event: DomainEvent): Promise<void>;
}

interface DomainEvent {
    eventType: string;
}

class UserCreatedEvent implements DomainEvent {
    eventType = 'UserCreated';
    constructor(public userId: string) { }
}

class EmailAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`Email already exists: ${email}`);
        this.name = 'EmailAlreadyExistsError';
    }
}

class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService,
        private eventPublisher: EventPublisher
    ) { }

    async execute(command: CreateUserCommand): Promise<CreateUserResult> {
        // 1. 이메일 중복 확인
        const existingUser = await this.userRepository.findByEmail(command.email);
        if (existingUser) {
            throw new EmailAlreadyExistsError(command.email);
        }

        // 2. 사용자 생성 (도메인 로직)
        const user = User.create({
            name: command.name,
            email: command.email,
            password: command.password
        });

        // 3. 저장
        await this.userRepository.save(user);

        // 4. 환영 이메일 발송
        await this.emailService.sendWelcomeEmail(user.email);

        // 5. 이벤트 발행
        await this.eventPublisher.publish(new UserCreatedEvent(user.id));

        return { userId: user.id };
    }
}

// ============= Domain Layer (도메인 계층) =============
// 핵심 비즈니스 로직, 기술 세부사항 독립적

enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended'
}

interface CreateUserProps {
    name: string;
    email: string;
    password: string;
}

class InvalidNameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidNameError';
    }
}

class InvalidEmailError extends Error {
    constructor(email: string) {
        super(`Invalid email: ${email}`);
        this.name = 'InvalidEmailError';
    }
}

class InactiveUserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InactiveUserError';
    }
}

class User {
    private constructor(
        public readonly id: string,
        private name: string,
        private email: string,
        private passwordHash: string,
        private status: UserStatus
    ) { }

    static create(props: CreateUserProps): User {
        // 비즈니스 규칙 검증
        if (props.name.length < 2) {
            throw new InvalidNameError('Name must be at least 2 characters');
        }

        if (!this.isValidEmail(props.email)) {
            throw new InvalidEmailError(props.email);
        }

        // 비밀번호 해싱
        const passwordHash = this.hashPassword(props.password);

        return new User(
            crypto.randomUUID(),
            props.name,
            props.email,
            passwordHash,
            UserStatus.ACTIVE
        );
    }

    changeEmail(newEmail: string): void {
        // 비즈니스 규칙: 활성 사용자만 이메일 변경 가능
        if (this.status !== UserStatus.ACTIVE) {
            throw new InactiveUserError('Cannot change email for inactive user');
        }

        if (!User.isValidEmail(newEmail)) {
            throw new InvalidEmailError(newEmail);
        }

        this.email = newEmail;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getStatus(): UserStatus {
        return this.status;
    }

    private static isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private static hashPassword(password: string): string {
        // 실제로는 bcrypt 등 사용
        return `hashed_${password}`;
    }
}

// ============= Infrastructure Layer (인프라 계층) =============
// 데이터베이스, 외부 API, 프레임워크 특화 구현

interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}

// TypeORM 구현 예시
interface UserEntity {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    status: string;
}

class TypeORMUserRepository implements UserRepository {
    private users: Map<string, UserEntity> = new Map();  // 실제로는 DB

    async findById(id: string): Promise<User | null> {
        const entity = this.users.get(id);
        return entity ? this.toDomain(entity) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const entity of this.users.values()) {
            if (entity.email === email) {
                return this.toDomain(entity);
            }
        }
        return null;
    }

    async save(user: User): Promise<void> {
        const entity = this.toEntity(user);
        this.users.set(entity.id, entity);
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id);
    }

    private toDomain(entity: UserEntity): User {
        // ORM 엔티티를 도메인 모델로 변환
        return (User as any).reconstitute({
            id: entity.id,
            name: entity.name,
            email: entity.email,
            passwordHash: entity.passwordHash,
            status: entity.status as UserStatus
        });
    }

    private toEntity(user: User): UserEntity {
        // 도메인 모델을 ORM 엔티티로 변환
        return {
            id: user.id,
            name: user.getName(),
            email: user.getEmail(),
            passwordHash: (user as any).passwordHash,
            status: user.getStatus()
        };
    }
}

// 이메일 서비스 구현
class SMTPEmailService implements EmailService {
    async sendWelcomeEmail(email: string): Promise<void> {
        console.log(`Sending welcome email to ${email} via SMTP`);
        // 실제 SMTP 전송 로직
    }
}

// 이벤트 발행 구현
class InMemoryEventPublisher implements EventPublisher {
    private handlers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

    subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType)!.push(handler);
    }

    async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.eventType) || [];
        for (const handler of handlers) {
            await handler(event);
        }
    }
}

// ============= 의존성 주입 및 조립 =============

// 인프라 구현 생성
const userRepository = new TypeORMUserRepository();
const emailService = new SMTPEmailService();
const eventPublisher = new InMemoryEventPublisher();

// 애플리케이션 레이어 조립
const createUserUseCase = new CreateUserUseCase(
    userRepository,
    emailService,
    eventPublisher
);

// 표현 레이어 조립
const userController = new UserController(createUserUseCase);

// 사용 예시
async function exampleUsage() {
    const mockReq: Request = {
        body: {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass123'
        }
    };

    const mockRes: Response = {
        status(code: number) {
            console.log(`Response status: ${code}`);
            return this;
        },
        json(data: any) {
            console.log('Response data:', JSON.stringify(data, null, 2));
        }
    };

    await userController.createUser(mockReq, mockRes);
}

// 레이어 간 의존성 방향
// Presentation → Application → Domain ← Infrastructure
// 모든 레이어는 Domain을 향해 의존 (의존성 역전 원칙)
