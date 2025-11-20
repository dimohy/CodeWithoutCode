// 개방-폐쇄 원칙 (OCP) 예시
// 확장에는 열려있고, 수정에는 닫혀있어야 한다

// ❌ 나쁜 방식: 새로운 결제 수단 추가 시 기존 함수 수정 필요
function processPaymentBad(method: string, amount: number) {
    if (method === 'card') {
        // 카드 결제 로직
        console.log(`카드로 ${amount}원 결제`);
    } else if (method === 'bank') {
        // 은행 이체 로직
        console.log(`은행 이체로 ${amount}원 결제`);
    } else if (method === 'mobile') {  // 새로운 수단 추가 시 이 함수 수정!
        // 모바일 결제 로직
        console.log(`모바일로 ${amount}원 결제`);
    }
}

// ✅ 좋은 방식: 인터페이스 기반, 새로운 클래스 추가만으로 확장
interface PaymentMethod {
    process(amount: number): Promise<PaymentResult>;
}

class CardPayment implements PaymentMethod {
    async process(amount: number): Promise<PaymentResult> {
        console.log(`카드로 ${amount}원 결제`);
        return { success: true, transactionId: 'card-001' };
    }
}

class BankPayment implements PaymentMethod {
    async process(amount: number): Promise<PaymentResult> {
        console.log(`은행 이체로 ${amount}원 결제`);
        return { success: true, transactionId: 'bank-001' };
    }
}

class MobilePayment implements PaymentMethod {
    async process(amount: number): Promise<PaymentResult> {
        console.log(`모바일로 ${amount}원 결제`);
        return { success: true, transactionId: 'mobile-001' };
    }
}

// 새로운 결제 수단 추가: 기존 코드 수정 불필요!
class CryptoPayment implements PaymentMethod {
    async process(amount: number): Promise<PaymentResult> {
        console.log(`암호화폐로 ${amount}원 결제`);
        return { success: true, transactionId: 'crypto-001' };
    }
}

// 결제 처리 매니저
class PaymentProcessor {
    private methods: Map<string, PaymentMethod> = new Map();

    registerMethod(name: string, method: PaymentMethod): void {
        this.methods.set(name, method);
    }

    async processPayment(methodName: string, amount: number): Promise<PaymentResult> {
        const method = this.methods.get(methodName);
        if (!method) {
            throw new Error(`지원하지 않는 결제 수단: ${methodName}`);
        }
        return await method.process(amount);
    }
}

// 사용 예시
const processor = new PaymentProcessor();
processor.registerMethod('card', new CardPayment());
processor.registerMethod('bank', new BankPayment());
processor.registerMethod('mobile', new MobilePayment());
processor.registerMethod('crypto', new CryptoPayment()); // 새로운 방법 등록

type PaymentResult = {
    success: boolean;
    transactionId: string;
};
