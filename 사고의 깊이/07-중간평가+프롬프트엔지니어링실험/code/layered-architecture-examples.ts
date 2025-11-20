// Chapter 7 실습 - 아키텍처 패턴 및 추상화 계층 예시

// ============= 실습 1: 나쁜 예 vs 좋은 예 =============

// ❌ 나쁜 예: 모든 관심사가 뒤섞임
class BadOrderService {
    async createOrder(orderData: any) {
        // 데이터베이스 직접 접근
        const result = await db.query('INSERT INTO orders...');

        // HTTP 호출 직접
        await fetch('https://payment-api.com/charge', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        // 이메일 발송 로직 직접
        await sendEmail(orderData.email, 'Order Created', '...');

        return result;
    }
}

// ============= 좋은 예: 관심사 분리 + 의존성 역전 =============

// 인터페이스 정의 (의존성 역전)
interface IOrderRepository {
    save(order: Order): Promise<void>;
}

interface IPaymentService {
    charge(amount: Money, method: PaymentMethod): Promise<PaymentResult>;
}

interface INotificationService {
    sendOrderConfirmation(order: Order): Promise<void>;
}

interface IUnitOfWork {
    transaction<T>(work: () => Promise<T>): Promise<T>;
}

// Value Objects
class Money {
    constructor(private readonly amount: number) {
        if (amount < 0) {
            throw new Error('금액은 0 이상이어야 합니다');
        }
    }

    add(other: Money): Money {
        return new Money(this.amount + other.amount);
    }

    static zero(): Money {
        return new Money(0);
    }

    get value(): number {
        return this.amount;
    }
}

enum OrderStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Shipped = 'shipped',
    Delivered = 'delivered',
    Cancelled = 'cancelled'
}

class DomainException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DomainException';
    }
}

// 도메인 계층: 비즈니스 로직만
class Order {
    private constructor(
        public readonly id: string,
        private _status: OrderStatus,
        private _totalAmount: Money
    ) { }

    static create(items: OrderItem[]): Order {
        // 도메인 규칙: 주문은 최소 1개 항목 필요
        if (items.length === 0) {
            throw new DomainException('주문 항목이 없습니다');
        }

        const totalAmount = items.reduce(
            (sum, item) => sum.add(item.subtotal),
            Money.zero()
        );

        return new Order(generateId(), OrderStatus.Pending, totalAmount);
    }

    confirm(): void {
        if (this._status !== OrderStatus.Pending) {
            throw new DomainException('대기 중인 주문만 확정할 수 있습니다');
        }
        this._status = OrderStatus.Confirmed;
    }

    get status(): OrderStatus {
        return this._status;
    }

    get totalAmount(): Money {
        return this._totalAmount;
    }
}

interface OrderItem {
    productId: string;
    quantity: number;
    subtotal: Money;
}

interface PaymentMethod {
    type: 'card' | 'bank' | 'mobile';
}

interface PaymentResult {
    success: boolean;
    transactionId?: string;
}

// 응용 계층: 유스케이스 오케스트레이션
class CreateOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
        private paymentService: IPaymentService,
        private notificationService: INotificationService,
        private unitOfWork: IUnitOfWork
    ) { }

    async execute(request: CreateOrderRequest): Promise<CreateOrderResponse> {
        return this.unitOfWork.transaction(async () => {
            // 1. 도메인 엔티티 생성
            const order = Order.create(request.items);

            // 2. 결제 처리 (인터페이스를 통해)
            const paymentResult = await this.paymentService.charge(
                order.totalAmount,
                request.paymentMethod
            );

            // 3. 주문 확정
            order.confirm();

            // 4. 저장 (인터페이스를 통해)
            await this.orderRepository.save(order);

            // 5. 알림 (인터페이스를 통해)
            await this.notificationService.sendOrderConfirmation(order);

            return CreateOrderResponse.from(order);
        });
    }
}

interface CreateOrderRequest {
    items: OrderItem[];
    paymentMethod: PaymentMethod;
}

class CreateOrderResponse {
    constructor(
        public readonly orderId: string,
        public readonly status: OrderStatus,
        public readonly totalAmount: number
    ) { }

    static from(order: Order): CreateOrderResponse {
        return new CreateOrderResponse(
            order.id,
            order.status,
            order.totalAmount.value
        );
    }
}

function generateId(): string {
    return crypto.randomUUID();
}

// ============= 실습 2: 사용자 생성 - 나쁜 예 vs 좋은 예 =============

// ❌ 문제가 있는 코드
class BadUserController {
    async createUser(req: Request, res: Response) {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password; // 평문!

        await db.query(`INSERT INTO users VALUES (...)`, user);

        res.json({ id: user.id });
    }
}

// ✅ 개선된 코드 (추상화 계층 적용)

// Value Object
class Email {
    constructor(private readonly value: string) {
        if (!this.isValid(value)) {
            throw new Error('유효하지 않은 이메일 형식입니다');
        }
    }

    private isValid(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    toString(): string {
        return this.value;
    }
}

// 인터페이스
interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
}

interface IPasswordHasher {
    hash(password: string): Promise<string>;
}

interface IEmailService {
    sendWelcomeEmail(email: string): Promise<void>;
}

class ConflictException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictException';
    }
}

// 1. Presentation Layer
class UserController {
    constructor(private createUserUseCase: CreateUserUseCase) { }

    // @Post('/users')
    // @ValidateBody(CreateUserDto)
    async createUser(dto: CreateUserDto): Promise<UserResponse> {
        const result = await this.createUserUseCase.execute({
            name: dto.name,
            email: dto.email,
            password: dto.password
        });

        return UserResponse.from(result);
    }
}

interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

class UserResponse {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string
    ) { }

    static from(user: User): UserResponse {
        return new UserResponse(user.id, user.name, user.email.toString());
    }
}

// 2. Application Layer
class CreateUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private passwordHasher: IPasswordHasher,
        private emailService: IEmailService
    ) { }

    async execute(request: CreateUserRequest): Promise<User> {
        // 중복 확인
        const existing = await this.userRepository.findByEmail(request.email);
        if (existing) {
            throw new ConflictException('이미 존재하는 이메일입니다');
        }

        // 비밀번호 해싱
        const hashedPassword = await this.passwordHasher.hash(request.password);

        // 도메인 엔티티 생성
        const user = User.create(request.name, request.email, hashedPassword);

        // 저장
        await this.userRepository.save(user);

        // 환영 이메일 (비동기)
        await this.emailService.sendWelcomeEmail(user.email.toString());

        return user;
    }
}

interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

// 3. Domain Layer
class User {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: Email,
        private readonly passwordHash: string,
        private _isActive: boolean
    ) { }

    static create(name: string, email: string, passwordHash: string): User {
        // 도메인 규칙 검증
        if (!name || name.length < 2) {
            throw new DomainException('이름은 2자 이상이어야 합니다');
        }

        return new User(
            generateId(),
            name,
            new Email(email),
            passwordHash,
            true
        );
    }

    deactivate(): void {
        if (!this._isActive) {
            throw new DomainException('이미 비활성화된 사용자입니다');
        }
        this._isActive = false;
    }

    get isActive(): boolean {
        return this._isActive;
    }
}
