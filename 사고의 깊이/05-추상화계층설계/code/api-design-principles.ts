// 5주차: 추상화 계층 설계 - API 설계 원칙과 패턴

// ============= 1. API 설계 원칙 =============

// 원칙 1: 최소 놀라움의 법칙 - 일관된 명명과 동작

// ✅ 좋은 예: 일관된 명명 규칙
interface UserRepository {
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}

// ❌ 나쁜 예: 일관성 없는 명명
interface BadUserRepository {
    get(id: string): Promise<User | undefined>;  // find vs get 혼용
    list(): Promise<User[]>;  // findAll vs list 혼용
    persist(user: User): Promise<User>;  // save vs persist 혼용, 불필요한 반환
    remove(user: User): Promise<boolean>;  // 매개변수 타입 불일치
}

// 원칙 2: 표현력 있는 이름

// ✅ 좋은 예
class OrderService {
    createOrder(customerId: string, items: OrderItem[]): Promise<Order> { /* */ }
    cancelOrder(orderId: string, reason: string): Promise<void> { /* */ }
    getOrderHistory(customerId: string, startDate: Date, endDate: Date): Promise<Order[]> { /* */ }
}

// ❌ 나쁜 예
class BadOrderService {
    create(cid: string, itm: any[]): Promise<any> { /* */ }  // 약어, any 타입
    cancel(id: string): Promise<void> { /* */ }  // 이유 누락
    get(cid: string, d1: Date, d2: Date): Promise<any> { /* */ }
}

// 원칙 3: 강타입 활용 - Brand Types

type UserId = string & { __brand: 'UserId' };
type OrderId = string & { __brand: 'OrderId' };
type Email = string & { __brand: 'Email' };

function createUserId(id: string): UserId {
    return id as UserId;
}

function sendOrderConfirmation(orderId: OrderId, email: Email): void {
    console.log(`Sending confirmation for order ${orderId} to ${email}`);
}

// 컴파일 에러 방지: 타입 불일치
const userId = createUserId('user-123');
const orderId = 'order-456' as OrderId;
const email = 'user@example.com' as Email;

// sendOrderConfirmation(userId, email); // 컴파일 에러!
sendOrderConfirmation(orderId, email); // OK

// 원칙 4: 불변성 우선

class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: string
    ) {
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
    }

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    multiply(factor: number): Money {
        return new Money(this.amount * factor, this.currency);
    }

    static zero(currency: string): Money {
        return new Money(0, currency);
    }
}

// 원칙 5: 에러 처리 명시 - Result 타입

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

class PaymentError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'PaymentError';
    }
}

interface PaymentConfirmation {
    transactionId: string;
    amount: Money;
    timestamp: Date;
}

async function processPayment(
    amount: Money,
    method: string
): Promise<Result<PaymentConfirmation, PaymentError>> {
    try {
        // 결제 처리 시뮬레이션
        if (amount.amount <= 0) {
            return {
                ok: false,
                error: new PaymentError('Invalid amount', 'INVALID_AMOUNT')
            };
        }

        const confirmation: PaymentConfirmation = {
            transactionId: crypto.randomUUID(),
            amount,
            timestamp: new Date()
        };

        return { ok: true, value: confirmation };
    } catch (error) {
        return {
            ok: false,
            error: new PaymentError((error as Error).message, 'UNKNOWN_ERROR')
        };
    }
}

// 사용 예
async function examplePayment() {
    const result = await processPayment(new Money(100, 'USD'), 'card');

    if (result.ok) {
        console.log('Payment successful:', result.value.transactionId);
    } else {
        console.error('Payment failed:', result.error.message);
    }
}

// 원칙 6: 버전 관리 고려 - 확장 가능한 옵션 객체

// ❌ 나쁜 예: 매개변수 추가로 하위 호환성 깨짐
// function createUser(name: string): Promise<User>
// function createUser(name: string, email: string): Promise<User> // Breaking change!

// ✅ 좋은 예: 옵션 객체 사용
interface CreateUserOptions {
    name: string;
    email?: string;
    phone?: string;
    address?: Address;
    preferences?: UserPreferences;
}

interface Address {
    street: string;
    city: string;
    country: string;
}

interface UserPreferences {
    notifications: boolean;
    newsletter: boolean;
}

interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
}

async function createUser(options: CreateUserOptions): Promise<User> {
    return {
        id: crypto.randomUUID(),
        name: options.name,
        email: options.email,
        phone: options.phone
    };
}

// ============= 2. 모듈 인터페이스 설계 =============

// Facade 패턴: 복잡한 하위 시스템 단순화

class EmailValidator {
    validate(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

class PhoneValidator {
    validate(phone: string, country: string): boolean {
        // 국가별 전화번호 검증
        return phone.length >= 10;
    }
}

class PasswordValidator {
    validate(password: string): boolean {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    }
}

class UserDatabase {
    async checkEmailExists(email: string): Promise<boolean> {
        // DB 조회
        return false;
    }
}

class UserNotificationService {
    async sendWelcomeEmail(email: string): Promise<void> {
        console.log(`Sending welcome email to ${email}`);
    }
}

// Facade: 단순한 인터페이스 제공
class UserRegistrationFacade {
    private emailValidator = new EmailValidator();
    private phoneValidator = new PhoneValidator();
    private passwordValidator = new PasswordValidator();
    private userDb = new UserDatabase();
    private notificationService = new UserNotificationService();

    async registerUser(options: CreateUserOptions & { password: string }): Promise<Result<User, string>> {
        // 1. 이메일 검증
        if (options.email && !this.emailValidator.validate(options.email)) {
            return { ok: false, error: 'Invalid email format' };
        }

        // 2. 비밀번호 검증
        if (!this.passwordValidator.validate(options.password)) {
            return { ok: false, error: 'Password must be at least 8 characters with uppercase and number' };
        }

        // 3. 중복 확인
        if (options.email && await this.userDb.checkEmailExists(options.email)) {
            return { ok: false, error: 'Email already exists' };
        }

        // 4. 사용자 생성
        const user = await createUser(options);

        // 5. 환영 이메일 발송
        if (user.email) {
            await this.notificationService.sendWelcomeEmail(user.email);
        }

        return { ok: true, value: user };
    }
}

// 사용: 복잡한 내부 동작을 숨기고 간단한 인터페이스 제공
const facade = new UserRegistrationFacade();
const result = await facade.registerUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
});

// ============= 3. 의존성 역전 원칙 (DIP) =============

// 추상 인터페이스
interface IUserRepository {
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: UserId): Promise<void>;
}

// PostgreSQL 구현
class PostgreSQLUserRepository implements IUserRepository {
    async findById(id: UserId): Promise<User | null> {
        console.log(`Querying PostgreSQL for user ${id}`);
        // const row = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
        // return row ? this.mapRowToUser(row) : null;
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        console.log(`Querying PostgreSQL for user with email ${email}`);
        return null;
    }

    async save(user: User): Promise<void> {
        console.log('Saving user to PostgreSQL');
    }

    async delete(id: UserId): Promise<void> {
        console.log('Deleting user from PostgreSQL');
    }
}

// MongoDB 구현
class MongoDBUserRepository implements IUserRepository {
    async findById(id: UserId): Promise<User | null> {
        console.log(`Querying MongoDB for user ${id}`);
        // const doc = await this.collection.findOne({ _id: id });
        // return doc ? this.mapDocToUser(doc) : null;
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        console.log(`Querying MongoDB for user with email ${email}`);
        return null;
    }

    async save(user: User): Promise<void> {
        console.log('Saving user to MongoDB');
    }

    async delete(id: UserId): Promise<void> {
        console.log('Deleting user from MongoDB');
    }
}

// 비즈니스 로직은 인터페이스에만 의존
class UserService {
    constructor(private userRepository: IUserRepository) { }

    async getUserById(id: UserId): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async createUser(options: CreateUserOptions): Promise<User> {
        const user = await createUser(options);
        await this.userRepository.save(user);
        return user;
    }
}

// 데이터베이스 변경 시 UserService는 수정 불필요
const postgresRepo = new PostgreSQLUserRepository();
const mongoRepo = new MongoDBUserRepository();

const userServiceWithPostgres = new UserService(postgresRepo);
const userServiceWithMongo = new UserService(mongoRepo);
