# 6주차: GitHub Copilot과의 협업 모델

## 개요

지난 5주 동안 여러분은 바이브 코딩의 이론적 기반과 컴퓨팅 사고, 그리고 추상화 계층 설계까지 학습했습니다. 이제 본격적으로 GitHub Copilot과 효과적으로 협업하는 방법을 깊이 있게 탐구할 시간입니다.

이번 주차는 GitHub Copilot을 단순한 코드 생성 도구가 아닌, 진정한 개발 파트너로 만들어주는 협업 모델을 다룹니다. Agent 모드의 고급 기능을 익히고, 프롬프트 엔지니어링의 심화 기법을 통해 복잡한 작업을 효과적으로 위임하는 방법을 배울 것입니다.

### 이번 주차에서 배울 내용

**1. GitHub Copilot Agent 기능 심화**
- Agent 모드를 통한 복잡한 작업 위임
- 멀티 파일 편집과 워크스페이스 컨텍스트 활용
- Agent와의 효과적인 대화 패턴

**2. 프롬프트 엔지니어링의 고급 기법**
- 명확한 제약 조건 명시로 정확도 높이기
- 컨텍스트 최적화를 통한 더 나은 결과 얻기
- 단계별 검증으로 품질 보장하기

**3. 반복적 개선 전략**
- 피드백 루프를 통한 점진적 개선
- 실패에서 배우는 프롬프트 최적화
- Agent와의 대화를 통한 요구사항 정제

**4. 실습: 코드 생성, 리뷰, 리팩토링**
- GitHub Copilot으로 새로운 기능 개발
- 생성된 코드의 품질 검증과 개선
- 기존 코드의 체계적인 리팩토링

이번 주차를 마치면 GitHub Copilot을 전문가 수준으로 활용하여, 개발 생산성을 극대화하면서도 코드 품질을 유지하는 방법을 체득하게 될 것입니다.

## 1. GitHub Copilot Agent 기능 심화

GitHub Copilot의 Agent 모드는 단순한 자동 완성을 넘어, 개발자의 의도를 이해하고 복잡한 작업을 자율적으로 수행하는 지능형 협업 파트너입니다. 이 섹션에서는 Agent 모드의 핵심 기능을 깊이 있게 탐구하고, 전문가 수준의 활용법을 배웁니다.

### Agent 모드의 작동 원리

Agent 모드는 세 가지 핵심 능력을 갖추고 있습니다:

**1. 컨텍스트 이해 능력**
Agent는 단순히 현재 파일만 보지 않습니다. 전체 워크스페이스의 구조, 프로젝트 설정, 관련 파일들의 관계를 종합적으로 파악합니다. 예를 들어 서비스 계층에 새 메서드를 추가해달라고 요청하면, Agent는 해당 서비스가 의존하는 리포지토리, DTO, 도메인 엔티티까지 자동으로 찾아내어 일관성 있는 코드를 생성합니다.

**2. 다단계 추론 능력**
복잡한 요청을 받으면 Agent는 이를 여러 단계로 분해하여 순차적으로 처리합니다. "로그인 기능을 구현해줘"라는 요청을 받으면, Agent는 다음과 같이 사고합니다:
- 인증 토큰 생성이 필요함
- 사용자 정보 검증 로직이 필요함
- 비밀번호 해싱 확인이 필요함
- 세션 관리나 JWT 토큰 발급이 필요함
- 에러 처리와 보안 검증이 필요함

이러한 추론 과정을 거쳐 필요한 모든 컴포넌트를 체계적으로 생성합니다.

**3. 자율적 문제 해결 능력**
Agent는 작업 수행 중 문제를 발견하면 스스로 해결 방법을 찾습니다. 타입 불일치나 의존성 문제가 발생하면, 관련 파일을 찾아 수정하거나 필요한 import 문을 추가합니다.

// 이미지로 교체되어야 함 : GitHub Copilot Agent의 작동 원리를 보여주는 다이어그램 - 사용자 요청 → 컨텍스트 분석 → 다단계 추론 → 파일 수정 → 검증의 순환 구조
프롬프트: A workflow diagram showing GitHub Copilot Agent's operation process: User Request (speech bubble) → Context Analysis (magnifying glass over file tree) → Multi-step Reasoning (thought cloud with numbered steps) → File Modifications (multiple file icons with edit symbols) → Validation (checkmark), arranged in a circular flow with arrows, professional tech illustration style, blue and purple color scheme

### 복잡한 작업 위임 전략

Agent에게 효과적으로 작업을 위임하려면 명확한 의도 전달이 핵심입니다. 다음은 작업 위임의 세 가지 수준입니다.

**레벨 1: 단순 작업 위임**
특정 파일의 명확한 수정을 요청합니다:

```
"UserService.ts에 findByEmail 메서드를 추가해줘. 
이메일로 사용자를 찾고, 없으면 null을 반환하도록."
```

이 수준에서는 Agent가 구체적인 지시를 따라 단일 파일을 수정합니다.

**레벨 2: 멀티 파일 작업 위임**
여러 파일에 걸친 일관된 변경을 요청합니다:

```
"주문 시스템에 취소 기능을 추가해줘.
- Order 엔티티에 cancel 메서드 추가
- OrderService에 비즈니스 로직 구현
- OrderController에 엔드포인트 추가
- 취소된 주문은 환불 처리되어야 함"
```

Agent는 도메인 계층, 서비스 계층, 컨트롤러 계층을 모두 이해하고 일관성 있게 수정합니다.

**레벨 3: 아키텍처 수준 작업 위임**
시스템 전체의 구조적 변경을 요청합니다:

```
"현재 이메일 알림을 동기적으로 보내고 있어. 
이를 메시지 큐 기반 비동기 처리로 변경하고 싶어.
- 알림 이벤트 정의
- 이벤트 발행 로직
- 메시지 큐 리스너
- 재시도 메커니즘
모두 구현해줘. RabbitMQ를 사용할 거야."
```

Agent는 이벤트 기반 아키텍처를 이해하고, 필요한 모든 계층의 코드를 생성합니다.

### 멀티 파일 편집과 워크스페이스 컨텍스트

Agent 모드의 강력함은 워크스페이스 전체를 이해하는 능력에서 나옵니다.

**워크스페이스 컨텍스트 구축**
Agent는 다음 정보를 자동으로 수집합니다:
- 프로젝트 구조와 디렉토리 계층
- package.json이나 tsconfig.json 같은 설정 파일
- 주요 모듈 간의 의존 관계
- 사용 중인 프레임워크와 라이브러리
- 코딩 스타일과 네이밍 컨벤션

**멀티 파일 편집 패턴**
실제 개발에서 자주 사용되는 멀티 파일 편집 패턴입니다:

*패턴 1: 수직 계층 수정*
새로운 API 엔드포인트를 추가할 때, Controller → Service → Repository → Entity 순서로 수정합니다.

TypeScript 예제:
```typescript
// Agent에게 요청: "상품 검색 API를 추가해줘"

// 1. src/entities/Product.ts - 엔티티 정의
export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
}

// 2. src/repositories/ProductRepository.ts - 데이터 접근
export interface IProductRepository {
  search(query: string): Promise<Product[]>;
}

export class ProductRepository implements IProductRepository {
  async search(query: string): Promise<Product[]> {
    // 검색 쿼리 구현
    return this.db.products
      .where('name', 'like', `%${query}%`)
      .orWhere('description', 'like', `%${query}%`)
      .get();
  }
}

// 3. src/services/ProductService.ts - 비즈니스 로직
export class ProductService {
  constructor(private repository: IProductRepository) {}
  
  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.length < 2) {
      throw new Error('검색어는 2자 이상이어야 합니다');
    }
    return this.repository.search(query);
  }
}

// 4. src/controllers/ProductController.ts - API 엔드포인트
export class ProductController {
  constructor(private service: ProductService) {}
  
  @Get('/search')
  async search(@Query('q') query: string) {
    return this.service.searchProducts(query);
  }
}
```

Agent는 각 계층의 역할을 이해하고 적절한 위치에 코드를 배치합니다.

*패턴 2: 수평 확산 수정*
새로운 기능을 추가할 때, 같은 계층의 여러 파일을 동시에 수정합니다.

```
"결제 시스템에 PayPal 지원을 추가해줘.
카드 결제와 동일한 인터페이스를 구현하도록."
```

Agent는 기존 `CardPaymentProvider`를 분석하고, 동일한 패턴으로 `PayPalPaymentProvider`를 생성합니다.

*패턴 3: 크로스커팅 수정*
여러 계층에 걸친 공통 관심사를 추가합니다.

```
"모든 API 호출에 대해 실행 시간을 로깅하는 기능을 추가해줘."
```

Agent는 인터셉터나 미들웨어 패턴을 적용하여, 각 컨트롤러를 일일이 수정하지 않고 공통 로직으로 처리합니다.

### Agent 모드 실행 방법 (실전 가이드)

Agent 모드를 처음 사용한다면 다음 단계를 따르세요:

**Agent 모드 시작하기:**

```
1단계: Chat View 열기
   - 단축키: Ctrl+Alt+I (Windows/Linux)
   - 또는 Command+Alt+I (macOS)
   - 또는 상단 메뉴에서 Chat 클릭

2단계: Agent 선택
   - Chat 입력창 위의 드롭다운 메뉴 클릭
   - "Agent" 옵션 선택
   - (다른 옵션: Plan, Ask, Edit도 있지만, 복잡한 작업은 Agent 사용)

3단계: 작업 요청
   - 자연어로 원하는 작업 입력
   - 예: "Create a TypeScript REST API for user management"
   
4단계: 변경사항 검토
   - Agent가 수정한 파일 목록 확인
   - 각 변경사항 리뷰
   - Accept 또는 Reject 선택
```

// 이미지로 교체되어야 함 : VS Code에서 Agent 모드 실행하는 전체 과정 스크린샷 - Ctrl+Alt+I → Agent 선택 → 프롬프트 입력 → 결과 확인 4단계
프롬프트: Step-by-step screenshot sequence showing how to use GitHub Copilot Agent mode in VS Code: 1) Pressing Ctrl+Alt+I to open Chat, 2) Clicking agent dropdown showing Agent/Plan/Ask/Edit options, 3) Typing prompt in chat input, 4) Reviewing file changes with Accept/Reject buttons, professional UI tutorial style, annotations with arrows

**Chat vs Inline vs Agent 실전 사용 시나리오:**

```
시나리오 1: 코드 설명이 필요할 때
→ Chat 모드 사용 (Ctrl+Alt+I, 그냥 Ask 선택)
예: "Explain how this authentication middleware works"

시나리오 2: 현재 파일만 빠르게 수정
→ Inline Chat 사용 (Ctrl+I, 파일 내에서)
예: 함수를 선택하고 "Add error handling"

시나리오 3: 새 기능 추가 (여러 파일)
→ Agent 모드 사용 (Ctrl+Alt+I, Agent 선택)
예: "Add email verification feature with nodemailer"

시나리오 4: 대규모 리팩토링
→ Agent 모드 사용
예: "Convert all class components to functional components with hooks"
```

**Agent 모드 활용 팁:**

1. **명확한 시작 지점 제공**
   ```
   나쁜 예: "사용자 관리 만들어줘"
   
   좋은 예: "src/modules/ 디렉토리에 users 모듈을 만들어줘.
   - UserController: Express 컨트롤러
   - UserService: 비즈니스 로직
   - UserRepository: Prisma ORM
   - 기존 프로젝트 구조 참고해서 동일한 패턴 따라줘"
   ```

2. **관련 파일 미리 열어두기**
   - Agent가 참고할 파일들을 VS Code에서 열어두면
   - 더 정확한 컨텍스트로 작업 수행

3. **단계별 확인**
   - 한 번에 모든 것을 요청하지 말고
   - 핵심부터 구현 → 테스트 → 확장

### Agent와의 효과적인 대화 패턴

Agent와의 대화는 일회성이 아닌 반복적인 협업입니다. 다음은 효과적인 대화 패턴입니다.

**패턴 1: 점진적 구체화**
처음에는 큰 그림을 제시하고, 대화를 통해 구체화합니다:

```
개발자: "블로그 포스트 시스템을 만들어줘."

Agent: "네, 다음 기능들을 포함할까요?
- 포스트 CRUD
- 카테고리 분류
- 태그 기능
- 댓글 시스템
- 검색 기능"

개발자: "맞아. 그리고 마크다운 에디터도 포함해줘."

Agent: "마크다운 라이브러리는 marked를 사용할까요, 
아니면 react-markdown을 선호하시나요?"

개발자: "react-markdown으로 해줘. 
그리고 실시간 미리보기도 넣어줘."
```

이런 대화를 통해 요구사항이 명확해지고, Agent는 더 정확한 코드를 생성합니다.

**실제 Agent 대화 예시 (TypeScript API 생성):**

```
[개발자가 Agent 모드에서 입력]
"Express TypeScript API를 만들어줘. 
사용자 관리 기능이 필요해."

[Agent 응답 및 질문]
"네, 사용자 관리 API를 만들겠습니다. 몇 가지 확인할게요:
1. 데이터베이스는 무엇을 사용하시나요?
2. 인증 방식은 JWT인가요?
3. 검증 라이브러리는 어떤 걸 선호하시나요?"

[개발자 추가 입력]
"Prisma + PostgreSQL 사용하고,
JWT 인증에 zod로 검증할게."

[Agent 작업 시작]
"알겠습니다. 다음 파일들을 생성하겠습니다:
✓ src/controllers/UserController.ts
✓ src/services/UserService.ts  
✓ src/middlewares/auth.ts
✓ src/validators/user.validator.ts
✓ prisma/schema.prisma 업데이트

[파일 생성 중... 완료]

변경사항을 확인하고 Accept 또는 수정 요청해주세요."
```

**패턴 2: 문제 지적과 개선**
생성된 코드에 문제가 있으면 구체적으로 지적합니다:

```
개발자: "방금 생성한 UserService에서 
비밀번호를 평문으로 저장하고 있어. 
bcrypt로 해싱하도록 수정해줘."

Agent: "네, bcrypt를 사용하여 비밀번호를 해싱하도록 수정하겠습니다.
또한 비밀번호 검증 메서드도 추가할까요?"

개발자: "그래, 그리고 salt rounds는 12로 설정해줘."
```

**패턴 3: 제약 조건 추가**
보안, 성능, 규칙 등의 제약을 명시합니다:

```
"페이지네이션을 구현할 때 
한 페이지에 최대 50개 항목만 허용하도록 제한해줘.
그리고 SQL injection 방지를 위해 
파라미터화된 쿼리를 사용해야 해."
```

Agent는 이러한 제약을 모두 반영하여 안전한 코드를 생성합니다.

**패턴 4: 컨텍스트 공유**
프로젝트의 특수한 맥락을 설명합니다:

```
"우리 프로젝트는 Clean Architecture를 따르고 있어.
모든 비즈니스 로직은 도메인 계층에 있어야 하고,
외부 의존성은 인프라 계층에 격리되어야 해.
이 원칙을 지키면서 알림 시스템을 구현해줘."
```

이렇게 아키텍처 원칙을 명시하면, Agent는 프로젝트의 구조적 일관성을 유지합니다.

### Agent 모드 활용 시 주의사항

**1. 과도한 의존 주의**
Agent가 아무리 강력해도, 생성된 코드를 검토하지 않으면 안 됩니다. 특히 보안, 성능, 비즈니스 로직의 정확성은 반드시 검증해야 합니다.

**2. 명확한 경계 설정**
Agent에게 전체 시스템을 한 번에 맡기기보다는, 명확한 범위를 정의하여 단계적으로 작업하는 것이 효과적입니다.

**3. 프로젝트 표준 준수**
Agent는 일반적인 베스트 프랙티스를 따르지만, 프로젝트만의 고유한 규칙이 있다면 명시적으로 알려주어야 합니다.

이제 이러한 Agent 기능을 더 효과적으로 활용하기 위한 프롬프트 엔지니어링 기법을 살펴보겠습니다.

## 2. 프롬프트 엔지니어링의 고급 기법

프롬프트 엔지니어링은 AI와의 효과적인 소통을 위한 핵심 기술입니다. 좋은 프롬프트는 정확한 결과를 만들고, 나쁜 프롬프트는 시간을 낭비하게 만듭니다. 이 섹션에서는 전문가 수준의 프롬프트 작성 기법을 배웁니다.

### 명확한 제약 조건 명시

제약 조건을 명확히 하면 Agent가 잘못된 방향으로 가는 것을 방지할 수 있습니다.

**제약 조건의 세 가지 유형**

*1. 기술적 제약*
```
"사용자 인증 시스템을 구현해줘.
- JWT 토큰 사용
- 토큰 유효기간은 24시간
- Refresh token도 구현 (유효기간 30일)
- TypeScript 타입 안정성 보장
- 환경 변수로 시크릿 키 관리"
```

이렇게 구체적으로 명시하면, Agent는 정확히 요구사항에 맞는 코드를 생성합니다.

*2. 비즈니스 제약*
```
"주문 시스템에서 주문 취소 로직을 구현해줘.
- 결제 완료 후 30분 이내만 취소 가능
- 배송 시작된 주문은 취소 불가
- 취소 시 자동 환불 처리
- 취소 사유는 필수 입력"
```

비즈니스 규칙을 명확히 하면, 도메인 로직이 정확히 구현됩니다.

*3. 보안/성능 제약*
```
"게시판 검색 기능을 구현해줘.
- SQL Injection 방지 (파라미터화된 쿼리)
- 검색어는 최소 2자 이상
- 한 페이지 최대 50개 결과
- 인덱스를 활용한 빠른 검색
- 검색 결과 캐싱 (5분)"
```

보안과 성능 요구사항을 명시하면, 안전하고 효율적인 코드가 생성됩니다.

**제약 조건 명시의 실전 예제**

TypeScript로 결제 시스템을 구현하는 프롬프트:

```
"결제 처리 서비스를 구현해줘.

제약 조건:
1. 기술적 제약:
   - Strategy 패턴으로 여러 결제 수단 지원 (카드, 계좌이체, 간편결제)
   - 모든 금액은 Decimal 타입 사용 (부동소수점 오류 방지)
   - 트랜잭션 처리 보장 (결제 실패 시 롤백)

2. 비즈니스 제약:
   - 최소 결제 금액 1,000원
   - 최대 결제 금액 1,000,000원
   - 동시 결제 요청 방지 (같은 주문에 대해)
   - 결제 타임아웃 5분

3. 보안 제약:
   - 카드 정보는 암호화 저장
   - PCI DSS 준수
   - 결제 이력은 감사 로그 기록

4. 성능 제약:
   - 결제 처리는 3초 이내
   - 동시 처리 최대 1000 TPS
"
```

이런 프롬프트를 받으면 Agent는 다음과 같은 구조를 생성합니다:

```typescript
// Strategy 패턴 인터페이스
interface PaymentStrategy {
  pay(amount: Decimal, paymentInfo: PaymentInfo): Promise<PaymentResult>;
  validate(paymentInfo: PaymentInfo): boolean;
}

// Decimal 타입으로 금액 관리
type Money = Decimal;

// 결제 서비스
class PaymentService {
  private strategies: Map<PaymentMethod, PaymentStrategy>;
  private locks: Map<string, boolean>; // 동시 결제 방지
  
  async processPayment(
    orderId: string,
    amount: Money,
    method: PaymentMethod,
    info: PaymentInfo
  ): Promise<PaymentResult> {
    // 제약 조건 검증
    this.validateAmount(amount);
    this.preventConcurrentPayment(orderId);
    
    // 트랜잭션 시작
    const transaction = await this.db.transaction();
    
    try {
      const strategy = this.strategies.get(method);
      const result = await Promise.race([
        strategy.pay(amount, info),
        this.timeout(5 * 60 * 1000) // 5분 타임아웃
      ]);
      
      // 감사 로그 기록
      await this.auditLog.record({
        orderId,
        amount: amount.toString(),
        method,
        timestamp: new Date(),
        result: result.status
      });
      
      await transaction.commit();
      return result;
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      this.releaseLock(orderId);
    }
  }
  
  private validateAmount(amount: Money): void {
    if (amount.lessThan(new Decimal(1000))) {
      throw new Error('최소 결제 금액은 1,000원입니다');
    }
    if (amount.greaterThan(new Decimal(1000000))) {
      throw new Error('최대 결제 금액은 1,000,000원입니다');
    }
  }
  
  private preventConcurrentPayment(orderId: string): void {
    if (this.locks.get(orderId)) {
      throw new Error('이미 처리 중인 주문입니다');
    }
    this.locks.set(orderId, true);
  }
}
```

제약 조건을 명확히 명시하면, Agent는 모든 요구사항을 반영한 견고한 코드를 생성합니다.

### 컨텍스트 최적화 기법

Agent에게 제공하는 컨텍스트의 질이 결과의 질을 결정합니다.

**컨텍스트 최적화의 세 가지 원칙**

*원칙 1: 관련성 높은 정보만 제공*
너무 많은 정보는 오히려 방해가 됩니다. 현재 작업과 직접 관련된 정보에 집중하세요.

나쁜 예:
```
"우리 프로젝트는 2019년에 시작했고, React로 만들어졌어. 
처음엔 Redux를 썼는데 나중에 MobX로 바꿨고, 
지금은 Zustand를 쓰고 있어. 
회원가입 폼에 이메일 검증을 추가해줘."
```

좋은 예:
```
"회원가입 폼에 이메일 검증을 추가해줘.
- 현재 src/components/SignupForm.tsx 사용 중
- 상태 관리는 Zustand
- 검증은 zod 라이브러리로 처리
- 이메일 형식과 중복 확인 필요"
```

*원칙 2: 구조적 정보 제공*
프로젝트의 구조를 알려주면 Agent가 더 나은 결정을 내립니다.

```
"새로운 기능을 추가할 때 다음 구조를 따라줘:
src/
  features/
    {feature-name}/
      components/     # UI 컴포넌트
      hooks/          # 커스텀 훅
      services/       # API 호출
      types/          # TypeScript 타입
      index.ts        # 공개 API

이 구조로 '알림' 기능을 구현해줘."
```

*원칙 3: 예제 제공*
기존 코드의 스타일을 따르게 하려면 예제를 보여줍니다.

```
"기존 ProductService와 동일한 패턴으로 OrderService를 만들어줘.

참고할 ProductService 구조:
- constructor에서 repository 주입
- 모든 public 메서드는 async
- 에러는 커스텀 Exception 사용
- 로깅은 Logger 인터페이스 사용
"
```

// 이미지로 교체되어야 함 : 컨텍스트 최적화를 시각화한 다이어그램 - 왼쪽에 "너무 많은 정보" (혼란스러운 문서 더미), 가운데 "최적화된 컨텍스트" (정리된 핵심 정보), 오른쪽에 "고품질 결과" (깔끔한 코드)
프롬프트: A three-panel diagram showing context optimization: Left panel labeled "Too Much Info" with cluttered documents and messy stack of papers, center panel labeled "Optimized Context" with clean organized information cards highlighting key points, right panel labeled "High Quality Result" with clean, well-formatted code on screen, connected by arrows showing transformation flow, modern infographic style, teal and orange color scheme

### 단계별 검증 전략

복잡한 작업을 한 번에 완성하려 하지 말고, 단계별로 검증하며 진행합니다.

**3단계 검증 프로세스**

*1단계: 구조 검증*
먼저 전체 구조가 올바른지 확인합니다.

```
개발자: "전자상거래 주문 시스템의 구조를 설계해줘. 
코드는 아직 생성하지 말고, 
필요한 컴포넌트와 관계만 보여줘."

Agent: "다음 컴포넌트가 필요합니다:
1. Order (도메인 엔티티)
2. OrderItem (주문 항목)
3. OrderRepository (데이터 접근)
4. OrderService (비즈니스 로직)
5. PaymentService (결제 처리)
6. InventoryService (재고 관리)
7. OrderController (API 엔드포인트)

주요 플로우:
주문 생성 → 재고 확인 → 결제 처리 → 주문 확정"

개발자: "좋아. 여기에 배송 관리도 추가해줘."

Agent: "ShippingService를 추가하겠습니다.
주문 확정 → 배송 준비 → 배송 시작 → 배송 완료"
```

구조가 확정되면 코드 생성으로 넘어갑니다.

*2단계: 핵심 로직 검증*
가장 중요한 비즈니스 로직부터 구현하고 검증합니다.

```
개발자: "Order 엔티티와 OrderService의 핵심 로직만 먼저 구현해줘.
주문 생성과 취소 기능만."

Agent: [Order 엔티티와 OrderService 생성]

개발자: "주문 취소 로직에서 
이미 배송 시작된 주문도 취소되는 것 같아.
배송 상태를 확인하도록 수정해줘."

Agent: [취소 로직 보완]
```

핵심 로직이 검증되면 나머지 기능을 추가합니다.

*3단계: 통합 검증*
전체 시스템이 함께 동작하는지 확인합니다.

```
개발자: "이제 전체 주문 플로우를 통합 테스트로 검증해줘.
주문 생성부터 배송 완료까지 전체 시나리오를 포함해서."

Agent: [통합 테스트 코드 생성]
```

**검증 체크리스트**
각 단계에서 다음을 확인합니다:
- [ ] 비즈니스 규칙이 정확히 구현되었는가?
- [ ] 에러 처리가 적절한가?
- [ ] 타입 안정성이 보장되는가?
- [ ] 성능상 문제가 없는가?
- [ ] 보안 취약점이 없는가?
- [ ] 테스트 가능한 구조인가?

### 고급 프롬프트 패턴

전문가들이 자주 사용하는 프롬프트 패턴입니다.

**패턴 1: 롤 플레잉**
Agent에게 특정 역할을 부여합니다.

```
"시니어 백엔드 아키텍트로서, 
우리 마이크로서비스 아키텍처를 리뷰해줘.
특히 서비스 간 통신과 데이터 일관성에 집중해서."
```

**패턴 2: 예제 기반 학습 (Few-Shot Learning)**
원하는 스타일의 예제를 제공합니다.

```
"다음 스타일로 API 엔드포인트를 작성해줘:

예제:
@Get('/users/:id')
@ApiResponse({ type: UserDto })
@UseGuards(AuthGuard)
async getUser(@Param('id') id: string): Promise<UserDto> {
  return this.service.findById(id);
}

이 스타일로 '주문 목록 조회' 엔드포인트를 만들어줘."
```

**패턴 3: 제약 기반 생성**
특정 제약 하에서 최선의 솔루션을 찾게 합니다.

```
"다음 제약 조건에서 파일 업로드 기능을 구현해줘:
- 외부 라이브러리 사용 불가 (Node.js 내장 모듈만)
- 메모리 사용량 최소화 (스트림 처리 필수)
- 업로드 진행률 추적 가능
- 대용량 파일 지원 (최대 5GB)"
```

**패턴 4: 비교 분석**
여러 접근 방법을 비교하게 합니다.

```
"상태 관리를 위해 Redux, MobX, Zustand 중 선택해야 해.
우리 프로젝트 상황:
- 중규모 팀 (5명)
- 복잡한 비즈니스 로직
- 리얼타임 업데이트 많음
- 러닝 커브 최소화 중요

각 솔루션의 장단점을 우리 상황에 맞춰 비교해줘."
```

### C#에서의 프롬프트 엔지니어링

C# 프로젝트에서도 동일한 원칙이 적용되지만, .NET 생태계의 특성을 활용할 수 있습니다.

**C# 프로젝트 컨텍스트 제공**

```
"ASP.NET Core Web API 프로젝트에서 
Clean Architecture를 적용한 주문 시스템을 만들어줘.

프로젝트 구조:
- OrderSystem.Domain: 엔티티와 인터페이스
- OrderSystem.Application: Use Cases와 DTO
- OrderSystem.Infrastructure: 리포지토리와 외부 서비스
- OrderSystem.WebApi: 컨트롤러와 미들웨어

기술 스택:
- Entity Framework Core (Code First)
- MediatR (CQRS 패턴)
- FluentValidation (검증)
- Serilog (로깅)
"
```

Agent는 .NET 프로젝트 구조와 규칙을 이해하고 적절한 코드를 생성합니다:

```csharp
// Domain Layer - Order.cs
namespace OrderSystem.Domain.Entities
{
    public class Order
    {
        public Guid Id { get; private set; }
        public string CustomerId { get; private set; }
        public OrderStatus Status { get; private set; }
        public decimal TotalAmount { get; private set; }
        public DateTime CreatedAt { get; private set; }
        
        private readonly List<OrderItem> _items = new();
        public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();
        
        public void AddItem(Product product, int quantity)
        {
            if (Status != OrderStatus.Draft)
                throw new InvalidOperationException("확정된 주문은 수정할 수 없습니다");
            
            _items.Add(new OrderItem(product, quantity));
            RecalculateTotal();
        }
        
        public void Confirm()
        {
            if (_items.Count == 0)
                throw new InvalidOperationException("주문 항목이 없습니다");
            
            Status = OrderStatus.Confirmed;
        }
        
        private void RecalculateTotal()
        {
            TotalAmount = _items.Sum(item => item.Subtotal);
        }
    }
}

// Application Layer - CreateOrderCommand.cs
namespace OrderSystem.Application.Orders.Commands
{
    public class CreateOrderCommand : IRequest<Guid>
    {
        public string CustomerId { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }
    
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
    {
        private readonly IOrderRepository _repository;
        private readonly IProductRepository _productRepository;
        
        public CreateOrderCommandHandler(
            IOrderRepository repository,
            IProductRepository productRepository)
        {
            _repository = repository;
            _productRepository = productRepository;
        }
        
        public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new Order(request.CustomerId);
            
            foreach (var item in request.Items)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                order.AddItem(product, item.Quantity);
            }
            
            order.Confirm();
            await _repository.AddAsync(order);
            
            return order.Id;
        }
    }
}
```

C#의 강력한 타입 시스템과 LINQ, async/await 같은 기능을 활용한 코드가 생성됩니다.

이제 이러한 프롬프트 기법을 실전에서 어떻게 반복적으로 개선하는지 살펴보겠습니다.

## 3. 반복적 개선 전략과 피드백 루프

완벽한 프롬프트를 한 번에 작성하는 것은 불가능합니다. 전문가들은 반복적으로 개선하며 최적의 결과를 만들어냅니다. 이 섹션에서는 실패에서 배우고, 지속적으로 개선하는 전략을 다룹니다.

### 피드백 루프의 이해

효과적인 협업은 빠른 피드백 루프에서 나옵니다. Agent와의 협업도 마찬가지입니다.

**피드백 루프의 4단계**

1. **요청 (Request)**: 명확한 프롬프트 작성
2. **생성 (Generate)**: Agent가 코드 생성
3. **검토 (Review)**: 결과 분석 및 문제 파악
4. **개선 (Refine)**: 피드백 반영하여 재요청

이 사이클을 빠르게 반복할수록 더 나은 결과를 얻습니다.

**피드백 루프 실전 예제**

*첫 번째 시도 (초안)*
```
개발자: "사용자 로그인 API를 만들어줘."

Agent: [기본적인 로그인 API 생성]
- 이메일/비밀번호 받기
- 사용자 조회
- 비밀번호 비교
- JWT 토큰 반환
```

검토 결과, 보안 문제와 에러 처리가 부족합니다.

*두 번째 시도 (보안 강화)*
```
개발자: "방금 만든 로그인 API에 다음을 추가해줘:
- 비밀번호는 bcrypt로 해싱된 것과 비교
- 로그인 실패 시 계정 잠금 (5회 실패 시)
- IP별 요청 제한 (1분에 10회)
- 상세한 에러 로깅"

Agent: [보안이 강화된 버전 생성]
```

더 나아지긴 했지만, 사용자 경험이 부족합니다.

*세 번째 시도 (UX 개선)*
```
개발자: "로그인 실패 시 사용자 친화적인 메시지를 추가해줘:
- 이메일이 없으면 '등록되지 않은 이메일입니다'
- 비밀번호가 틀리면 '비밀번호가 일치하지 않습니다'
- 계정 잠금 시 '로그인 시도 횟수 초과. X분 후 다시 시도해주세요'
그리고 각 경우에 적절한 HTTP 상태 코드도 반환해줘."

Agent: [완성된 로그인 API 생성]
```

TypeScript 최종 버전:

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MINUTES = 15;
  private readonly RATE_LIMIT_WINDOW_MS = 60000; // 1분
  private readonly RATE_LIMIT_MAX_REQUESTS = 10;
  
  async login(request: LoginRequest, ipAddress: string): Promise<LoginResponse> {
    // 1. IP 기반 요청 제한 확인
    await this.checkRateLimit(ipAddress);
    
    // 2. 이메일로 사용자 조회
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      await this.logFailedAttempt(request.email, ipAddress, 'EMAIL_NOT_FOUND');
      throw new UnauthorizedException('등록되지 않은 이메일입니다');
    }
    
    // 3. 계정 잠금 확인
    if (user.isLocked()) {
      const remainingMinutes = user.getRemainingLockMinutes();
      throw new TooManyRequestsException(
        `로그인 시도 횟수 초과. ${remainingMinutes}분 후 다시 시도해주세요`
      );
    }
    
    // 4. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(request.password, user.passwordHash);
    if (!isPasswordValid) {
      user.incrementFailedAttempts();
      
      if (user.failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        user.lockAccount(this.LOCK_DURATION_MINUTES);
        await this.userRepository.save(user);
        await this.logFailedAttempt(request.email, ipAddress, 'ACCOUNT_LOCKED');
        throw new TooManyRequestsException(
          `로그인 시도 횟수 초과. ${this.LOCK_DURATION_MINUTES}분 후 다시 시도해주세요`
        );
      }
      
      await this.userRepository.save(user);
      await this.logFailedAttempt(request.email, ipAddress, 'WRONG_PASSWORD');
      
      const remainingAttempts = this.MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts;
      throw new UnauthorizedException(
        `비밀번호가 일치하지 않습니다 (남은 시도: ${remainingAttempts}회)`
      );
    }
    
    // 5. 로그인 성공 처리
    user.resetFailedAttempts();
    user.updateLastLoginAt();
    await this.userRepository.save(user);
    
    // 6. JWT 토큰 생성
    const tokens = await this.generateTokens(user);
    
    await this.logSuccessfulLogin(user.id, ipAddress);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: UserDto.fromEntity(user)
    };
  }
  
  private async checkRateLimit(ipAddress: string): Promise<void> {
    const requestCount = await this.rateLimiter.getRequestCount(
      ipAddress,
      this.RATE_LIMIT_WINDOW_MS
    );
    
    if (requestCount >= this.RATE_LIMIT_MAX_REQUESTS) {
      throw new TooManyRequestsException(
        '요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해주세요'
      );
    }
    
    await this.rateLimiter.incrementRequestCount(ipAddress);
  }
}
```

세 번의 반복을 거쳐 안전하고 사용자 친화적인 로그인 API가 완성되었습니다.

### 점진적 개선의 원칙

**원칙 1: 작게 시작하고 점진적으로 확장**
한 번에 모든 것을 구현하려 하지 말고, 핵심 기능부터 시작합니다.

```
1차: 기본 기능만 구현
2차: 에러 처리 추가
3차: 검증 로직 강화
4차: 성능 최적화
5차: 로깅과 모니터링 추가
```

**원칙 2: 각 단계마다 검증**
다음 단계로 넘어가기 전에 현재 단계가 제대로 작동하는지 확인합니다.

```
개발자: "방금 구현한 주문 생성 로직을 테스트해줘.
정상 케이스와 에러 케이스를 모두 포함해서."

Agent: [테스트 코드 생성 및 실행]

개발자: "재고 부족 케이스에서 에러가 발생하지 않아.
재고 확인 로직을 수정해줘."
```

**원칙 3: 피드백을 구체적으로**
"이상해" 대신 "어떤 부분이 왜 문제인지" 명확히 설명합니다.

나쁜 피드백:
```
"이 코드 이상해. 다시 만들어줘."
```

좋은 피드백:
```
"UserService.createUser 메서드에서 
이메일 중복 체크를 하지 않아서 
같은 이메일로 여러 계정이 생성될 수 있어.
이메일 중복 체크를 추가하고,
중복이면 ConflictException을 던지도록 수정해줘."
```

### 실패에서 배우는 프롬프트 최적화

실패는 프롬프트를 개선하는 가장 좋은 기회입니다.

**실패 패턴 분석**

*패턴 1: 모호한 요청*
```
실패 프롬프트: "데이터를 저장하는 기능을 만들어줘."

문제: 어떤 데이터? 어디에? 어떤 방식으로?

개선 프롬프트: "User 엔티티를 PostgreSQL에 저장하는 
UserRepository를 만들어줘. TypeORM을 사용하고,
트랜잭션 처리를 포함해줘."
```

*패턴 2: 제약 조건 누락*
```
실패 프롬프트: "파일 업로드 기능을 구현해줘."

결과: 무제한 파일 크기, 보안 검증 없음, 타입 체크 없음

개선 프롬프트: "파일 업로드 기능을 구현해줘.
- 최대 파일 크기 5MB
- 허용 타입: JPG, PNG, PDF
- 파일명 중복 방지 (UUID 사용)
- 악성 파일 검증 (MIME 타입 확인)
- S3에 업로드"
```

*패턴 3: 컨텍스트 부족*
```
실패 프롬프트: "에러 처리를 추가해줘."

결과: 프로젝트 스타일과 맞지 않는 에러 처리

개선 프롬프트: "우리 프로젝트의 에러 처리 패턴을 따라줘:
- 모든 에러는 AppError 클래스 상속
- HTTP 상태 코드와 메시지 포함
- 로깅은 Logger.error() 사용
- 클라이언트에는 민감한 정보 노출 금지"
```

// 이미지로 교체되어야 함 : 실패에서 배우는 프롬프트 개선 프로세스 - 실패한 프롬프트 → 문제 분석 → 개선된 프롬프트 → 성공적인 결과, 각 단계를 화살표로 연결하고 각 단계별 체크포인트 표시
프롬프트: A flow diagram showing prompt improvement from failure: Failed Prompt (red X icon) → Problem Analysis (magnifying glass examining issues: ambiguous, missing constraints, no context) → Improved Prompt (green edit icon with specific details highlighted) → Successful Result (green checkmark with quality code), connected by arrows, includes feedback loop arrow from result back to analysis, clean instructional diagram style, red to green gradient

### Agent와의 대화를 통한 요구사항 정제

요구사항이 불명확할 때는 Agent와 대화하며 점진적으로 명확히 합니다.

**대화형 요구사항 정제 예제**

```
개발자: "고객 관리 시스템을 만들어줘."

Agent: "고객 관리 시스템을 만들겠습니다. 
다음 기능들을 포함할까요?
1. 고객 정보 CRUD
2. 고객 그룹 관리
3. 고객 활동 이력 추적
4. 고객 통계 및 리포트
어떤 기능이 우선인가요?"

개발자: "일단 1번과 3번만. 
그리고 고객 정보에는 
이름, 이메일, 전화번호, 주소, 가입일이 포함돼야 해."

Agent: "알겠습니다. 추가 질문입니다:
- 이메일은 unique해야 하나요?
- 전화번호 형식 검증이 필요한가요?
- 주소는 어떤 형식인가요? (국내만? 해외 포함?)
- 활동 이력에는 어떤 정보를 기록할까요?"

개발자: "
- 이메일은 unique, 필수 항목
- 전화번호는 한국 형식만 (010-xxxx-xxxx)
- 주소는 국내만, 우편번호 포함
- 활동 이력은 고객의 주문, 문의, 클레임 기록"

Agent: "완벽합니다. 다음 구조로 구현하겠습니다:

Customer 엔티티:
- id (UUID)
- email (unique, required)
- name (required)
- phoneNumber (한국 형식 검증)
- address (우편번호 포함)
- createdAt

Activity 엔티티:
- id
- customerId (FK)
- type (ORDER | INQUIRY | CLAIM)
- description
- createdAt

이렇게 진행할까요?"

개발자: "완벽해. 그대로 구현해줘."
```

이런 대화를 통해 요구사항이 명확해지고, Agent는 정확히 원하는 것을 구현할 수 있습니다.

### 지속적 개선 전략

프롬프트는 한 번 작성하고 끝나는 것이 아니라, 프로젝트가 진행되면서 계속 개선됩니다.

**프롬프트 라이브러리 구축**
잘 작동하는 프롬프트를 문서화하여 재사용합니다.

```markdown
# 프롬프트 라이브러리

## API 엔드포인트 생성
```
[기능명] API 엔드포인트를 만들어줘.

구조:
- Controller: HTTP 요청/응답 처리
- Service: 비즈니스 로직
- Repository: 데이터 접근

제약:
- DTO로 데이터 검증
- 에러는 AppError 사용
- 트랜잭션 처리
- 로깅 포함
```

## 테스트 코드 생성
```
[대상 클래스]의 테스트 코드를 작성해줘.

포함 사항:
- 정상 케이스
- 경계값 테스트
- 에러 케이스
- Mock을 사용한 의존성 격리
```
```

**패턴 인식과 템플릿화**
반복되는 작업은 템플릿으로 만듭니다.

```
"새로운 [엔티티명] 기능을 추가할 때 
다음 템플릿을 사용해줘:

1. src/entities/[엔티티명].ts
   - 엔티티 정의 (TypeORM)
   - 비즈니스 메서드

2. src/repositories/[엔티티명]Repository.ts
   - 인터페이스 정의
   - 구현 클래스

3. src/services/[엔티티명]Service.ts
   - CRUD 로직
   - 비즈니스 규칙

4. src/controllers/[엔티티명]Controller.ts
   - REST API 엔드포인트
   - DTO 검증

5. tests/[엔티티명].test.ts
   - 단위 테스트
   - 통합 테스트
"
```

**메트릭 추적**
프롬프트의 효과를 측정합니다:
- 첫 번째 시도에서 정확한 결과를 얻은 비율
- 원하는 결과를 얻기까지 평균 반복 횟수
- 생성된 코드의 수정이 필요한 비율

이러한 메트릭을 통해 프롬프트 작성 능력을 객관적으로 개선할 수 있습니다.

### 협업 패턴의 성숙도

Agent와의 협업도 성숙도 단계가 있습니다:

**레벨 1: 의존형**
- Agent에게 모든 것을 물어봄
- 결과를 비판 없이 수용
- 에러가 나면 당황함

**레벨 2: 검증형**
- Agent의 결과를 항상 검토
- 문제가 있으면 구체적으로 피드백
- 단계별로 검증하며 진행

**레벨 3: 협업형**
- Agent의 강점과 약점을 이해
- 적절한 작업 분배
- 효율적인 프롬프트 작성

**레벨 4: 최적화형**
- 프롬프트 패턴 라이브러리 보유
- 프로젝트에 맞는 컨텍스트 최적화
- Agent를 팀의 일원처럼 활용

이번 주차의 목표는 최소한 레벨 3에 도달하는 것입니다.

이제 배운 내용을 실습으로 확인해보겠습니다.

## 4. 실습: GitHub Copilot을 활용한 코드 생성, 리뷰, 리팩토링

이번 실습에서는 실제 프로젝트에서 자주 마주치는 세 가지 시나리오를 다룹니다: 새로운 기능 개발, 코드 리뷰, 그리고 레거시 코드 리팩토링입니다.

### 실습 준비

새로운 프로젝트를 시작하겠습니다. GitHub Copilot을 열고 다음과 같이 요청하세요:

```
"TypeScript로 블로그 플랫폼 프로젝트를 생성해줘.
- Express.js 백엔드
- TypeORM (PostgreSQL)
- Clean Architecture 구조
- 기본 설정 파일들 (tsconfig, package.json)

프로젝트 구조:
src/
  domain/
  application/
  infrastructure/
  presentation/
tests/
"
```

Agent가 프로젝트 구조와 기본 설정을 생성하면 실습을 시작합니다.

### 실습 1: 새로운 기능 개발 - 댓글 시스템

**목표**: GitHub Copilot과 협업하여 댓글 기능을 처음부터 완성합니다.

**Step 1: 요구사항 정의와 Agent 대화**

GitHub Copilot에게 다음과 같이 요청하세요:

```
"블로그 포스트에 댓글 기능을 추가하고 싶어.
어떤 엔티티와 기능이 필요한지 먼저 제안해줘.
코드는 아직 생성하지 말고."
```

Agent가 제안을 하면, 여러분의 요구사항을 추가로 명시합니다:

```
"좋아. 여기에 다음 기능도 추가해줘:
- 대댓글 지원 (최대 3단계 깊이)
- 댓글 수정/삭제 (작성자만 가능)
- 댓글 좋아요
- 비속어 필터링
- 페이지네이션 (한 페이지 20개)"
```

**Step 2: 도메인 엔티티 생성**

요구사항이 확정되면 구현을 시작합니다:

```
"Comment 엔티티를 생성해줘. 
도메인 주도 설계 원칙을 따라서:
- 불변성 보장
- 비즈니스 로직 캡슐화
- 유효성 검증 포함"
```

Agent가 생성한 코드를 검토합니다. 다음 사항을 확인하세요:
- [ ] 비즈니스 규칙이 엔티티 내부에 구현되어 있는가?
- [ ] 불필요한 setter가 없는가?
- [ ] 대댓글 관계가 올바르게 모델링되어 있는가?
- [ ] 댓글 깊이 제한이 적용되어 있는가?

문제가 있다면 구체적으로 피드백합니다:

```
"Comment 엔티티에서 parentComment가 순환 참조를 일으킬 수 있어.
최대 깊이 3을 초과하는지 검증하는 로직을 추가해줘."
```

**Step 3: 비속어 필터링 구현**

Agent에게 도메인 서비스를 요청합니다:

```
"CommentModerationService를 만들어줘.
비속어 필터링 기능을 구현하는데,
- 금지어 목록은 데이터베이스에서 관리
- 금지어가 포함되면 ModerationException 발생
- 로깅 포함"
```

TypeScript 예제 결과:

```typescript
// domain/services/CommentModerationService.ts
export class CommentModerationService {
  constructor(
    private bannedWordsRepository: IBannedWordsRepository,
    private logger: ILogger
  ) {}
  
  async checkContent(content: string): Promise<void> {
    const bannedWords = await this.bannedWordsRepository.findAll();
    const lowerContent = content.toLowerCase();
    
    const foundBannedWord = bannedWords.find(word => 
      lowerContent.includes(word.toLowerCase())
    );
    
    if (foundBannedWord) {
      this.logger.warn('Banned word detected', {
        word: foundBannedWord,
        content: content.substring(0, 50) // 로그에 일부만 기록
      });
      
      throw new ModerationException(
        '부적절한 내용이 포함되어 있습니다',
        foundBannedWord
      );
    }
  }
}

// domain/entities/Comment.ts
export class Comment {
  private constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly authorId: string,
    private _content: string,
    public readonly parentId: string | null,
    private _depth: number,
    private _likes: number,
    private _isDeleted: boolean,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validateDepth();
  }
  
  static create(
    postId: string,
    authorId: string,
    content: string,
    parentComment?: Comment
  ): Comment {
    const depth = parentComment ? parentComment.depth + 1 : 0;
    
    if (depth > 3) {
      throw new DomainException('댓글은 최대 3단계까지만 가능합니다');
    }
    
    return new Comment(
      generateId(),
      postId,
      authorId,
      content,
      parentComment?.id ?? null,
      depth,
      0,
      false,
      new Date(),
      new Date()
    );
  }
  
  get content(): string {
    if (this._isDeleted) {
      return '삭제된 댓글입니다';
    }
    return this._content;
  }
  
  get depth(): number {
    return this._depth;
  }
  
  updateContent(newContent: string, requesterId: string): void {
    if (this._isDeleted) {
      throw new DomainException('삭제된 댓글은 수정할 수 없습니다');
    }
    
    if (this.authorId !== requesterId) {
      throw new UnauthorizedException('댓글 작성자만 수정할 수 있습니다');
    }
    
    this._content = newContent;
    this._updatedAt = new Date();
  }
  
  delete(requesterId: string): void {
    if (this.authorId !== requesterId) {
      throw new UnauthorizedException('댓글 작성자만 삭제할 수 있습니다');
    }
    
    this._isDeleted = true;
  }
  
  like(): void {
    if (this._isDeleted) {
      throw new DomainException('삭제된 댓글에는 좋아요를 할 수 없습니다');
    }
    this._likes++;
  }
  
  private validateDepth(): void {
    if (this._depth < 0 || this._depth > 3) {
      throw new DomainException('잘못된 댓글 깊이입니다');
    }
  }
}
```

**Step 4: Application Layer 구현**

Use Case를 구현합니다:

```
"CreateCommentUseCase를 구현해줘.
- 포스트 존재 여부 확인
- 비속어 필터링
- 댓글 저장
- 트랜잭션 처리
- 댓글 생성 이벤트 발행"
```

**Step 5: 테스트 작성**

```
"Comment 엔티티와 CreateCommentUseCase의 
단위 테스트를 작성해줘.
모든 엣지 케이스를 포함해서."
```

Agent가 생성한 테스트를 실행하고, 실패하는 테스트가 있으면 수정합니다.

### 실습 2: 코드 리뷰 - 보안 취약점 찾기

**목표**: GitHub Copilot을 활용하여 기존 코드의 보안 문제를 찾고 수정합니다.

다음은 취약한 코드 예제입니다:

```typescript
// 의도적으로 취약하게 작성된 코드
class UserController {
  async getUser(req: Request, res: Response) {
    const userId = req.params.id;
    const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
    res.json(user);
  }
  
  async updatePassword(req: Request, res: Response) {
    const { userId, newPassword } = req.body;
    await db.query(`UPDATE users SET password = '${newPassword}' WHERE id = ${userId}`);
    res.json({ message: 'Password updated' });
  }
}
```

GitHub Copilot에게 리뷰를 요청합니다:

```
"위 UserController 코드를 보안 관점에서 리뷰해줘.
발견된 모든 보안 취약점과 개선 방법을 알려줘."
```

Agent가 지적할 주요 문제들:
1. SQL Injection 취약점
2. 비밀번호 평문 저장
3. 인증/권한 검증 누락
4. 에러 처리 부족
5. 민감한 정보 노출

이제 수정을 요청합니다:

```
"발견된 보안 취약점을 모두 수정해줘.
- 파라미터화된 쿼리 사용
- 비밀번호 bcrypt 해싱
- JWT 인증 미들웨어 추가
- 권한 검증
- 적절한 에러 처리
- 민감한 정보 필터링"
```

수정된 안전한 코드:

```typescript
class UserController {
  constructor(
    private userService: IUserService,
    private authService: IAuthService
  ) {}
  
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Param('id') userId: string,
    @CurrentUser() currentUser: User
  ): Promise<UserDto> {
    // 본인 또는 관리자만 조회 가능
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }
    
    try {
      const user = await this.userService.findById(userId);
      
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다');
      }
      
      // 민감한 정보 제외
      return UserDto.fromEntity(user);
      
    } catch (error) {
      this.logger.error('Failed to get user', { userId, error });
      throw error;
    }
  }
  
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() currentUser: User
  ): Promise<void> {
    // 본인만 비밀번호 변경 가능
    if (currentUser.id !== dto.userId) {
      throw new ForbiddenException('본인의 비밀번호만 변경할 수 있습니다');
    }
    
    // DTO 검증 (class-validator)
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    
    try {
      // 현재 비밀번호 확인
      const isCurrentPasswordValid = await this.authService.verifyPassword(
        currentUser.id,
        dto.currentPassword
      );
      
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다');
      }
      
      // 비밀번호 해싱 및 업데이트
      const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
      await this.userService.updatePassword(currentUser.id, hashedPassword);
      
      this.logger.info('Password updated successfully', { userId: currentUser.id });
      
    } catch (error) {
      this.logger.error('Failed to update password', { 
        userId: currentUser.id, 
        error 
      });
      throw error;
    }
  }
}
```

### 실습 3: 레거시 코드 리팩토링

**목표**: 복잡하고 유지보수가 어려운 레거시 코드를 Clean Architecture로 리팩토링합니다.

**레거시 코드 예제**:

```typescript
// 모든 것이 한 파일에 있는 레거시 코드
class OrderHandler {
  async processOrder(orderId: string) {
    // 데이터베이스 직접 접근
    const order = await db.query(`SELECT * FROM orders WHERE id = ${orderId}`);
    const items = await db.query(`SELECT * FROM order_items WHERE order_id = ${orderId}`);
    
    // 비즈니스 로직이 뒤섞여 있음
    let total = 0;
    for (let item of items) {
      const product = await db.query(`SELECT * FROM products WHERE id = ${item.product_id}`);
      total += product.price * item.quantity;
      
      // 재고 감소
      await db.query(`UPDATE products SET stock = stock - ${item.quantity} WHERE id = ${item.product_id}`);
    }
    
    // 결제 처리
    const paymentResult = await fetch('https://payment-api.com/charge', {
      method: 'POST',
      body: JSON.stringify({
        amount: total,
        cardNumber: order.card_number // 카드 번호 그대로 전송!
      })
    });
    
    // 주문 상태 업데이트
    if (paymentResult.ok) {
      await db.query(`UPDATE orders SET status = 'paid' WHERE id = ${orderId}`);
      
      // 이메일 발송
      await sendEmail(order.email, 'Order Confirmed', `Your order ${orderId} is confirmed`);
    }
    
    return { success: paymentResult.ok };
  }
}
```

GitHub Copilot에게 리팩토링을 요청합니다:

```
"위 OrderHandler 코드를 Clean Architecture로 리팩토링해줘.

요구사항:
1. Domain Layer: Order, OrderItem 엔티티와 비즈니스 로직
2. Application Layer: ProcessOrderUseCase
3. Infrastructure Layer: 리포지토리, 외부 서비스 어댑터
4. 관심사의 명확한 분리
5. 테스트 가능한 구조
6. 보안 취약점 제거
7. 트랜잭션 처리
8. 에러 처리

TypeScript와 SOLID 원칙을 따라줘."
```

Agent는 다음과 같이 리팩토링합니다:

```typescript
// Domain Layer - Order.ts
export class Order {
  constructor(
    public readonly id: string,
    private _status: OrderStatus,
    private _items: OrderItem[],
    public readonly customerId: string,
    private _totalAmount: Money,
    public readonly createdAt: Date
  ) {}
  
  get status(): OrderStatus {
    return this._status;
  }
  
  get items(): readonly OrderItem[] {
    return this._items;
  }
  
  get totalAmount(): Money {
    return this._totalAmount;
  }
  
  calculateTotal(): void {
    this._totalAmount = this._items.reduce(
      (sum, item) => sum.add(item.subtotal),
      Money.zero()
    );
  }
  
  markAsPaid(): void {
    if (this._status !== OrderStatus.Pending) {
      throw new DomainException('대기 중인 주문만 결제할 수 있습니다');
    }
    this._status = OrderStatus.Paid;
  }
  
  canBeCancelled(): boolean {
    return this._status === OrderStatus.Pending;
  }
}

// Application Layer - ProcessOrderUseCase.ts
export class ProcessOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentService: IPaymentService,
    private inventoryService: IInventoryService,
    private notificationService: INotificationService,
    private unitOfWork: IUnitOfWork
  ) {}
  
  async execute(request: ProcessOrderRequest): Promise<ProcessOrderResponse> {
    return this.unitOfWork.transaction(async () => {
      // 1. 주문 조회
      const order = await this.orderRepository.findById(request.orderId);
      if (!order) {
        throw new NotFoundException('주문을 찾을 수 없습니다');
      }
      
      // 2. 재고 확인 및 차감
      await this.reserveInventory(order);
      
      // 3. 결제 처리
      const paymentResult = await this.processPayment(order, request.paymentMethod);
      
      // 4. 주문 상태 업데이트
      order.markAsPaid();
      await this.orderRepository.save(order);
      
      // 5. 알림 발송 (비동기)
      await this.notificationService.sendOrderConfirmation(order);
      
      return {
        orderId: order.id,
        status: order.status,
        totalAmount: order.totalAmount
      };
    });
  }
  
  private async reserveInventory(order: Order): Promise<void> {
    for (const item of order.items) {
      const available = await this.inventoryService.checkAvailability(
        item.productId,
        item.quantity
      );
      
      if (!available) {
        throw new OutOfStockException(
          `상품 ${item.productId}의 재고가 부족합니다`
        );
      }
      
      await this.inventoryService.reserve(item.productId, item.quantity);
    }
  }
  
  private async processPayment(
    order: Order,
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> {
    try {
      return await this.paymentService.charge(
        order.totalAmount,
        paymentMethod
      );
    } catch (error) {
      // 재고 복구
      await this.rollbackInventory(order);
      throw new PaymentFailedException('결제 처리에 실패했습니다', error);
    }
  }
  
  private async rollbackInventory(order: Order): Promise<void> {
    for (const item of order.items) {
      await this.inventoryService.release(item.productId, item.quantity);
    }
  }
}

// Infrastructure Layer - PaymentServiceAdapter.ts
export class PaymentServiceAdapter implements IPaymentService {
  constructor(
    private httpClient: IHttpClient,
    private encryptionService: IEncryptionService,
    private config: PaymentConfig
  ) {}
  
  async charge(amount: Money, method: PaymentMethod): Promise<PaymentResult> {
    // 결제 정보 암호화
    const encryptedPaymentInfo = this.encryptionService.encrypt(
      JSON.stringify(method)
    );
    
    const response = await this.httpClient.post(
      `${this.config.apiUrl}/charge`,
      {
        amount: amount.toNumber(),
        encryptedPaymentInfo,
        merchantId: this.config.merchantId
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (!response.ok) {
      throw new PaymentGatewayException('결제 게이트웨이 오류', response.error);
    }
    
    return PaymentResult.fromResponse(response.data);
  }
}
```

리팩토링 결과를 검증합니다:

```
"리팩토링된 코드의 단위 테스트를 작성해줘.
각 계층을 독립적으로 테스트할 수 있도록."
```

### 실습 결과 비교

각 실습에서 학습한 내용을 정리해봅시다:

**실습 1 (새 기능 개발)**
- Agent와 대화하며 요구사항 정제
- 단계별 검증으로 품질 보장
- 도메인 주도 설계 적용

**실습 2 (코드 리뷰)**
- Agent를 보안 리뷰어로 활용
- 취약점 발견 및 즉시 수정
- 안전한 코딩 패턴 학습

**실습 3 (리팩토링)**
- 레거시를 현대적 아키텍처로 전환
- 관심사 분리와 의존성 역전
- 테스트 가능한 구조 확보

## 실습 결과 요약

이번 주차에서는 GitHub Copilot과의 효과적인 협업 모델을 깊이 있게 탐구했습니다. 단순한 코드 생성 도구를 넘어, 진정한 개발 파트너로 활용하는 방법을 배웠습니다.

### 핵심 학습 내용

**1. Agent 모드의 강력한 기능**
- 워크스페이스 전체 컨텍스트 이해
- 멀티 파일 편집을 통한 일관성 있는 코드 생성
- 복잡한 작업의 자율적 수행

우리는 Agent가 단일 파일만이 아니라 프로젝트 전체 구조를 이해하며, 계층 간 일관성을 유지하면서 코드를 생성한다는 것을 배웠습니다. 이는 전통적인 자동 완성과는 차원이 다른 협업 경험입니다.

**2. 프롬프트 엔지니어링의 중요성**
- 명확한 제약 조건 명시로 정확도 향상
- 컨텍스트 최적화로 더 나은 결과 도출
- 단계별 검증으로 품질 보장

프롬프트는 단순한 지시가 아니라, Agent와의 소통 언어입니다. 기술적, 비즈니스적, 보안적 제약을 명확히 하면 할수록, Agent는 더 정확한 코드를 생성합니다.

**3. 반복적 개선의 힘**
- 완벽한 첫 시도보다 빠른 피드백 루프가 중요
- 실패는 프롬프트를 개선하는 기회
- 패턴 인식과 템플릿화로 효율성 증대

처음부터 완벽할 필요는 없습니다. Agent와의 대화를 통해 요구사항을 정제하고, 단계적으로 개선하는 것이 더 효과적입니다.

**4. 실전 적용 능력**
- 새로운 기능 개발: 요구사항부터 테스트까지 전 과정 협업
- 코드 리뷰: 보안 취약점 발견 및 수정
- 리팩토링: 레거시를 현대적 아키텍처로 전환

실습을 통해 이론을 실제 코드로 구현하는 과정을 경험했습니다. 이는 실무에서 즉시 활용할 수 있는 실전 기술입니다.

### 프로페셔널 개발자로서의 GitHub Copilot 활용

이제 여러분은 GitHub Copilot을 다음과 같이 활용할 수 있습니다:

**문제 해결 파트너**
- 복잡한 문제를 함께 분해하고 해결 방법 탐색
- 여러 접근 방법을 비교하고 최적 솔루션 선택
- 예상하지 못한 엣지 케이스 발견

**코드 품질 향상 도구**
- 보안 취약점과 안티패턴 조기 발견
- 일관된 코딩 스타일과 아키텍처 패턴 적용
- 테스트 커버리지 확보

**생산성 극대화 수단**
- 반복적인 작업 자동화
- 멀티 파일 리팩토링의 신속한 수행
- 문서화와 주석 자동 생성

### 지속적 성장을 위한 실천 방법

이번 주차 학습을 바탕으로 다음을 실천하세요:

**1. 프롬프트 라이브러리 구축**
잘 작동하는 프롬프트를 문서화하고 재사용하세요. 프로젝트별, 작업 유형별로 템플릿을 만들어두면 시간이 갈수록 효율이 증가합니다.

**2. 협업 패턴 성숙도 향상**
현재 자신의 협업 레벨을 파악하고, 다음 레벨로 나아가기 위한 목표를 세우세요:
- 레벨 2 → 3: 모든 생성 코드를 검증하고 구체적 피드백 제공
- 레벨 3 → 4: 프롬프트 패턴 라이브러리 구축 및 컨텍스트 최적화

**3. 실전 프로젝트에 적용**
학습한 내용을 실제 프로젝트에 적용하며 경험을 쌓으세요. 작은 기능부터 시작하여 점차 복잡한 작업으로 확장하세요.

**4. 팀과 지식 공유**
효과적인 프롬프트 패턴을 팀과 공유하세요. 팀 차원에서 Agent 활용 역량이 향상되면, 전체 개발 생산성이 크게 증가합니다.

### 다음 주차 예고

7주차에서는 중간평가와 함께 프롬프트 엔지니어링 실험을 진행합니다:
- 1~6주차 내용의 종합 평가
- 동일한 문제에 대한 다양한 프롬프트 패턴 비교
- 프롬프트 최적화 기법 실험
- 각 패턴의 장단점 분석

여러분이 배운 Agent 협업 기술을 다양한 시나리오에 적용하며, 어떤 상황에서 어떤 프롬프트 전략이 가장 효과적인지 발견하게 될 것입니다.

---

**이번 주차 자가 점검**

다음 질문에 답하며 학습 내용을 점검하세요:

1. Agent 모드의 세 가지 핵심 능력을 설명할 수 있나요?
2. 효과적인 프롬프트의 필수 요소는 무엇인가요?
3. 피드백 루프의 4단계를 실제 개발에 적용할 수 있나요?
4. 레거시 코드 리팩토링 시 Agent를 어떻게 활용할 수 있나요?
5. 프롬프트 라이브러리를 구축하기 시작했나요?

모든 질문에 자신 있게 답할 수 있다면, 여러분은 GitHub Copilot 협업 모델을 제대로 이해한 것입니다. 이제 7주차 중간평가를 준비하세요!
