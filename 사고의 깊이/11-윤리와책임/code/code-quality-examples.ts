// AI 생성 코드의 품질 관리 예시

// ============================================
// 1. N+1 쿼리 문제 발견 및 해결
// ============================================

// 문제가 있는 코드
async function getUserOrders_Bad(userId: string) {
  const user = await userRepository.findById(userId);
  const orders = [];
  
  for (const orderId of user.orderIds) {
    const order = await orderRepository.findById(orderId); // N+1 문제!
    orders.push(order);
  }
  
  return orders;
}

// 개선된 코드
async function getUserOrders_Good(userId: string): Promise<Order[]> {
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new NotFoundException(`User ${userId} not found`);
  }
  
  // 한 번의 쿼리로 모든 주문 조회
  return await orderRepository.findByIds(user.orderIds);
}

// ============================================
// 2. 비즈니스 로직 정확성 검증
// ============================================

// AI가 생성한 단순한 할인 로직
function calculateDiscount_Simple(price: number, customerLevel: string): number {
  if (customerLevel === 'VIP') {
    return price * 0.8; // 20% 할인
  } else if (customerLevel === 'PREMIUM') {
    return price * 0.9; // 10% 할인
  }
  return price;
}

// 실제 비즈니스 요구사항을 반영한 로직
interface DiscountPolicy {
  customerLevel: 'VIP' | 'PREMIUM' | 'REGULAR';
  minPurchaseAmount: number;
  discountRate: number;
  maxDiscountAmount: number;
}

const DISCOUNT_POLICIES: Record<string, DiscountPolicy> = {
  VIP: { 
    customerLevel: 'VIP', 
    minPurchaseAmount: 0, 
    discountRate: 0.25, 
    maxDiscountAmount: 100000 
  },
  PREMIUM: { 
    customerLevel: 'PREMIUM', 
    minPurchaseAmount: 30000, 
    discountRate: 0.15, 
    maxDiscountAmount: 50000 
  },
  REGULAR: { 
    customerLevel: 'REGULAR', 
    minPurchaseAmount: 50000, 
    discountRate: 0.05, 
    maxDiscountAmount: 10000 
  }
};

function calculateDiscount_Correct(
  price: number, 
  customerLevel: string, 
  hasPromotion: boolean = false
): number {
  const policy = DISCOUNT_POLICIES[customerLevel];
  
  if (!policy) {
    throw new Error(`Invalid customer level: ${customerLevel}`);
  }
  
  if (price < policy.minPurchaseAmount) {
    return 0;
  }
  
  let discount = price * policy.discountRate;
  
  // 프로모션 중복 적용 방지
  if (hasPromotion) {
    discount = 0;
  }
  
  // 최대 할인 한도 적용
  return Math.min(discount, policy.maxDiscountAmount);
}

// ============================================
// 3. 팀 코딩 컨벤션 준수
// ============================================

// 컨벤션 위반 코드
async function getUser_Bad(id) { // 타입 미지정
  const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);
  return user;
}

// 팀 컨벤션 준수 코드
async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      logger.warn(`User not found: ${userId}`);
      return null;
    }
    
    return user;
  } catch (error) {
    logger.error(`Error fetching user ${userId}:`, error);
    throw new DatabaseException(`Failed to fetch user: ${userId}`);
  }
}

// ============================================
// 4. Agent 생성 코드의 일반적인 문제들
// ============================================

// 문제 1: N+1 쿼리 패턴
class OrderService_Bad {
  async getOrdersWithCustomers(orderIds: string[]): Promise<OrderWithCustomer[]> {
    const orders = await this.orderRepository.findByIds(orderIds);
    
    // 각 주문마다 고객 정보를 별도로 조회 (N+1!)
    return Promise.all(
      orders.map(async order => ({
        ...order,
        customer: await this.customerRepository.findById(order.customerId)
      }))
    );
  }
}

// 개선: 벌크 조회로 해결
class OrderService_Good {
  async getOrdersWithCustomers(orderIds: string[]): Promise<OrderWithCustomer[]> {
    const orders = await this.orderRepository.findByIds(orderIds);
    const customerIds = [...new Set(orders.map(o => o.customerId))];
    const customers = await this.customerRepository.findByIds(customerIds);
    
    const customerMap = new Map(customers.map(c => [c.id, c]));
    
    return orders.map(order => ({
      ...order,
      customer: customerMap.get(order.customerId)!
    }));
  }
}

// 문제 2: 누락된 트랜잭션 관리
class PaymentService_Bad {
  async processPayment(orderId: string, amount: number): Promise<void> {
    await this.orderRepository.updateStatus(orderId, 'PAID');
    await this.inventoryService.decreaseStock(orderId);
    await this.notificationService.sendPaymentConfirmation(orderId);
    // 중간에 실패하면 데이터 불일치 발생!
  }
}

// 개선: 트랜잭션으로 일관성 보장
class PaymentService_Good {
  async processPayment(orderId: string, amount: number): Promise<void> {
    await this.transactionManager.executeInTransaction(async (tx) => {
      await tx.orderRepository.updateStatus(orderId, 'PAID');
      await tx.inventoryService.decreaseStock(orderId);
    });
    
    // 트랜잭션 커밋 후 알림
    await this.notificationService.sendPaymentConfirmation(orderId);
  }
}
