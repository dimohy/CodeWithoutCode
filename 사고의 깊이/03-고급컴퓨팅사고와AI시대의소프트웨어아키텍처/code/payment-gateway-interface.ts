// 결제 게이트웨이 인터페이스 정의
// 사용 예: "PaymentGateway 인터페이스를 구현하는 StripePaymentGateway 클래스를 만들어줘"

interface PaymentGateway {
    processPayment(amount: number, method: string): Promise<PaymentResult>;
    refund(transactionId: string): Promise<RefundResult>;
    validateCard(cardNumber: string): boolean;
}

// Stripe 구현 예시
class StripePaymentGateway implements PaymentGateway {
    async processPayment(amount: number, method: string): Promise<PaymentResult> {
        // Stripe API 호출 로직
        const response = await stripe.charges.create({
            amount: amount * 100, // cents로 변환
            currency: 'usd',
            source: method
        });

        return {
            success: response.status === 'succeeded',
            transactionId: response.id
        };
    }

    async refund(transactionId: string): Promise<RefundResult> {
        const refund = await stripe.refunds.create({
            charge: transactionId
        });

        return {
            success: refund.status === 'succeeded',
            refundId: refund.id
        };
    }

    validateCard(cardNumber: string): boolean {
        // Luhn 알고리즘으로 카드 번호 검증
        return this.luhnCheck(cardNumber);
    }

    private luhnCheck(cardNumber: string): boolean {
        // 실제 Luhn 알고리즘 구현
        return true;
    }
}

type PaymentResult = {
    success: boolean;
    transactionId: string;
    errorMessage?: string;
};

type RefundResult = {
    success: boolean;
    refundId: string;
    errorMessage?: string;
};
