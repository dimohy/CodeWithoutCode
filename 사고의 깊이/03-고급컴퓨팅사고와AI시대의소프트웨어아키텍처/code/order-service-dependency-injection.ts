// 의존성 주입 패턴 예시
// OrderService가 여러 서비스에 의존하는 구조

interface PaymentGateway {
    processPayment(amount: number): Promise<PaymentResult>;
}

interface InventoryService {
    checkAvailability(productId: string, quantity: number): Promise<boolean>;
    reserveStock(productId: string, quantity: number): Promise<void>;
}

interface NotificationService {
    sendOrderConfirmation(orderId: string, email: string): Promise<void>;
}

class OrderService {
    constructor(
        private paymentGateway: PaymentGateway,
        private inventoryService: InventoryService,
        private notificationService: NotificationService
    ) { }

    async createOrder(orderData: OrderData): Promise<Order> {
        // 1. 재고 확인
        const available = await this.inventoryService.checkAvailability(
            orderData.productId,
            orderData.quantity
        );

        if (!available) {
            throw new Error('재고 부족');
        }

        // 2. 재고 예약
        await this.inventoryService.reserveStock(
            orderData.productId,
            orderData.quantity
        );

        // 3. 결제 처리
        const paymentResult = await this.paymentGateway.processPayment(
            orderData.totalAmount
        );

        if (!paymentResult.success) {
            throw new Error('결제 실패');
        }

        // 4. 주문 생성
        const order = new Order({
            id: generateId(),
            ...orderData,
            status: 'confirmed',
            paymentId: paymentResult.transactionId
        });

        // 5. 알림 발송
        await this.notificationService.sendOrderConfirmation(
            order.id,
            orderData.customerEmail
        );

        return order;
    }
}

type OrderData = {
    productId: string;
    quantity: number;
    totalAmount: number;
    customerEmail: string;
};

type Order = {
    id: string;
    productId: string;
    quantity: number;
    totalAmount: number;
    status: string;
    paymentId: string;
};

type PaymentResult = {
    success: boolean;
    transactionId: string;
};

function generateId(): string {
    return Math.random().toString(36).substring(7);
}
