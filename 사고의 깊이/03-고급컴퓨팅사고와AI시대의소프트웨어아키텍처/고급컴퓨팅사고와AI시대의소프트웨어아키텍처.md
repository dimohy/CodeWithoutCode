# Chapter 3. 고급 컴퓨팅 사고와 AI 시대의 소프트웨어 아키텍처

## 개요

지난 두 챕터에서 우리는 바이브 코딩의 개념과 컴퓨팅 사고의 4대 원리를 학습했습니다. 이제는 그 지식을 한 단계 더 높은 수준으로 끌어올릴 시간입니다. 3주차에서는 고급 컴퓨팅 사고를 통해 복잡한 시스템을 다루는 방법과, AI 시대에 맞는 새로운 소프트웨어 아키텍처 접근법을 배웁니다.

소프트웨어 아키텍처는 시스템의 골격입니다. 건물을 지을 때 구조 설계가 중요하듯이, 소프트웨어도 견고한 아키텍처 위에 세워져야 합니다. 하지만 AI가 코드를 생성하는 시대에, 아키텍처의 의미와 설계 방식은 근본적으로 변화하고 있습니다. 더 이상 모든 클래스와 함수를 미리 설계할 필요가 없습니다. 대신 시스템의 본질적 구조, 핵심 경계, 주요 의사결정 지점에 집중할 수 있습니다.

고급 컴퓨팅 사고의 핵심은 **문제 공간(Problem Space)**과 **솔루션 공간(Solution Space)**을 명확히 구분하고, 그 사이를 체계적으로 번역하는 능력입니다. 문제 공간은 비즈니스 요구사항, 사용자 니즈, 도메인 규칙이 존재하는 영역입니다. 솔루션 공간은 기술 스택, 아키텍처 패턴, 구현 방법이 있는 영역입니다. 뛰어난 개발자는 두 공간을 자유롭게 오가며, 문제를 깊이 이해하고 최적의 솔루션을 설계합니다.

이번 챕터에서는 또한 기존 개발 방법론의 한계를 살펴보고, AI 협업을 중심으로 한 새로운 개발 프로세스를 제안합니다. 워터폴, 애자일, DevOps를 넘어, **AI-Augmented Development**라는 새로운 패러다임을 탐구합니다. GitHub Copilot과 같은 AI 도구를 단순한 보조 수단이 아닌, 설계 프로세스의 핵심 파트너로 활용하는 방법을 배우게 됩니다.

**학습 목표:**
- 문제 공간과 솔루션 공간을 구분하고 효과적으로 번역하기
- 다중 추상화 레벨에서 시스템을 사고하는 능력 키우기
- AI 시대에 맞는 새로운 개발 방법론 이해하기
- AI 협업 기반 설계 패턴 습득하기
- GitHub Copilot을 활용한 실제 시스템 설계 경험하기
- 확장 가능하고 유지보수하기 쉬운 아키텍처 원칙 내재화하기

## 1. 고급 컴퓨팅 사고: 문제 공간과 솔루션 공간

### 문제 도메인 분석

**문제 공간(Problem Space)**은 해결해야 할 문제가 존재하는 영역입니다. 여기에는 비즈니스 규칙, 사용자 요구사항, 도메인 지식, 제약 조건이 포함됩니다. 문제 공간을 제대로 이해하지 못하면, 아무리 기술적으로 훌륭한 솔루션을 만들어도 실제 문제를 해결하지 못합니다.

문제 도메인 분석의 핵심 질문들:

**"진짜 문제가 무엇인가?"**  
표면적인 요구사항 이면의 본질적 문제를 파악해야 합니다. "고객이 상품을 빠르게 검색하고 싶어한다"는 요구사항의 이면에는 "현재 검색이 느리다"는 문제가 있고, 그 이면에는 "데이터베이스 쿼리가 비효율적이다" 또는 "인덱싱이 없다"는 근본 원인이 있을 수 있습니다.

**"누가 이해관계자인가?"**  
시스템의 모든 이해관계자를 식별해야 합니다. 최종 사용자뿐만 아니라, 관리자, 운영팀, 외부 시스템, 규제 기관 등이 각자의 요구사항을 가집니다. 이들의 우선순위가 충돌할 때 어떻게 조정할지도 고민해야 합니다.

**"도메인 규칙은 무엇인가?"**  
각 도메인에는 지켜야 할 불변 규칙(Invariants)이 있습니다. 회계 시스템에서는 차변과 대변이 항상 일치해야 하고, 재고 관리에서는 재고가 음수가 될 수 없으며, 예약 시스템에서는 이중 예약이 불가능해야 합니다. 이러한 규칙을 명확히 파악하고 코드로 강제해야 합니다.

**"경계는 어디인가?"**  
시스템이 책임지는 범위와 책임지지 않는 범위를 명확히 해야 합니다. 이커머스 시스템이 결제까지 처리할 것인가, 아니면 외부 결제 게이트웨이에 위임할 것인가? 재고 관리를 포함할 것인가, 아니면 별도 시스템과 연동할 것인가? 경계가 명확해야 설계도 명확해집니다.

도메인 분석을 위한 실천 방법:

**이벤트 스토밍(Event Storming)**을 활용하세요. 도메인 전문가와 개발팀이 함께 모여, 시스템에서 일어나는 주요 이벤트들을 시간순으로 나열합니다. "주문이 생성됨", "결제가 승인됨", "상품이 출고됨", "배송이 완료됨" 등의 이벤트를 통해 비즈니스 프로세스를 시각화하고 이해합니다.

**유비쿼터스 언어(Ubiquitous Language)**를 정의하세요. 도메인 전문가와 개발팀이 사용하는 용어를 통일합니다. "주문"이 Order인지 Purchase인지, "취소"가 Cancel인지 Return인지를 명확히 하고, 코드에서도 같은 용어를 사용합니다. 이는 의사소통의 명확성을 높이고, 코드의 가독성을 향상시킵니다.

**도메인 모델링**을 수행하세요. 핵심 엔티티, 값 객체(Value Objects), 집합체(Aggregates)를 식별합니다. 엔티티는 고유 식별자를 가진 객체(사용자, 주문 등)이고, 값 객체는 속성으로만 정의되는 객체(주소, 금액 등)이며, 집합체는 일관성 경계 내의 엔티티와 값 객체의 묶음입니다.

### 솔루션 설계 전략

**솔루션 공간(Solution Space)**은 문제를 해결하는 기술적 방법이 존재하는 영역입니다. 여기에는 아키텍처 패턴, 기술 스택, 데이터 구조, 알고리즘, 프레임워크 선택 등이 포함됩니다. 솔루션 공간에서의 결정은 시스템의 품질 속성(성능, 확장성, 보안, 유지보수성)에 직접적인 영향을 미칩니다.

문제 공간에서 솔루션 공간으로의 번역은 다음 단계로 진행됩니다:

**1단계: 품질 속성 우선순위 결정**

모든 품질 속성을 동시에 최대화할 수는 없습니다. 트레이드오프가 필연적입니다. 어떤 속성이 가장 중요한지 결정해야 합니다.

- **성능이 최우선인가?** 실시간 거래 시스템, 게임 서버, IoT 데이터 처리
- **확장성이 최우선인가?** 소셜 미디어, 동영상 스트리밍, 글로벌 SaaS
- **보안이 최우선인가?** 금융, 의료, 개인정보 처리 시스템
- **유지보수성이 최우선인가?** 장기 운영 시스템, 레거시 교체 프로젝트

**2단계: 아키텍처 스타일 선택**

문제의 특성에 맞는 아키텍처 스타일을 선택합니다.

- **모놀리식**: 작은 팀, 단순한 도메인, 빠른 개발 필요
- **마이크로서비스**: 대규모 팀, 복잡한 도메인, 독립적 배포 필요
- **이벤트 드리븐**: 비동기 처리, 느슨한 결합, 높은 확장성 필요
- **레이어드**: 명확한 관심사 분리, 전통적인 CRUD 애플리케이션
- **헥사고날(Ports & Adapters)**: 외부 의존성 격리, 테스트 용이성 중시

**3단계: 기술 스택 결정**

아키텍처 스타일에 맞는 구체적인 기술을 선택합니다. 이때 다음을 고려합니다:

- 팀의 기술 역량과 학습 곡선
- 커뮤니티 지원과 생태계
- 성능과 리소스 효율성
- 라이선스와 비용
- 장기 지원 가능성

**4단계: 설계 패턴 적용**

아키텍처 레벨의 큰 그림이 정해지면, 세부 설계에 패턴을 적용합니다. Repository 패턴으로 데이터 접근을 추상화하고, Factory 패턴으로 객체 생성을 캡슐화하며, Observer 패턴으로 이벤트를 처리하는 등, 검증된 패턴을 활용합니다.

**5단계: 프로토타이핑과 검증**

AI 시대의 큰 장점은 설계를 빠르게 프로토타입으로 만들어 검증할 수 있다는 것입니다. GitHub Copilot에게 아키텍처 초안을 요청하고, 실제로 작동하는 코드를 만들어보며, 설계의 타당성을 확인합니다. 이론적으로만 좋은 설계가 실제로는 문제가 있을 수 있고, 그 반대도 가능합니다.

---

**💡 GitHub Copilot Agent와 아키텍처 협업**

Agent 모드는 고수준 아키텍처 결정을 구체적인 코드 구조로 빠르게 변환하는 데 탁월합니다.

**효과적인 Agent 프롬프트 예시:**
```
마이크로서비스 아키텍처로 이커머스 시스템을 설계해줘.

품질 속성 우선순위:
1. 확장성 (동시 사용자 10만 명)
2. 가용성 (99.9% uptime)
3. 유지보수성

아키텍처 스타일: 이벤트 드리븐 + CQRS

기술 스택:
- API: TypeScript + NestJS
- 메시징: RabbitMQ
- 데이터: PostgreSQL (Write) + Redis (Read Cache)

다음을 생성해줘:
1. 서비스별 프로젝트 구조
2. 공통 인터페이스 정의
3. 이벤트 스키마
4. Docker Compose 구성
```

Agent는 이러한 고수준 요구사항을 받아 전체 프로젝트 구조를 생성하고, 여러분은 각 서비스의 비즈니스 로직에 집중할 수 있습니다.

// 이미지로 교체되어야 함 : 문제 공간에서 솔루션 공간으로의 번역 과정을 보여주는 플로우차트
프롬프트: A flowchart showing the translation from Problem Space to Solution Space, left side showing domain analysis and requirements, middle showing design decisions and trade-offs, right side showing architecture patterns and technical stack, arrows connecting the stages, modern technical diagram style, professional color scheme

### 다중 추상화 레벨과 시스템 사고

복잡한 시스템을 이해하고 설계하려면 **다중 추상화 레벨(Multiple Levels of Abstraction)**에서 사고할 수 있어야 합니다. 각 레벨은 서로 다른 관심사와 세부 수준을 가지며, 레벨 간에 일관성을 유지하는 것이 중요합니다.

**레벨 1: 비즈니스/도메인 레벨**  
가장 높은 추상화 레벨입니다. "우리는 고객에게 무엇을 제공하는가?", "핵심 비즈니스 프로세스는 무엇인가?"와 같은 질문에 답합니다. 이 레벨에서는 기술적 세부사항은 중요하지 않고, 비즈니스 가치와 사용자 경험에 집중합니다.

**레벨 2: 시스템/아키텍처 레벨**  
시스템을 주요 컴포넌트로 분해하고, 컴포넌트 간 상호작용을 정의합니다. "어떤 서비스들이 필요한가?", "서비스들은 어떻게 통신하는가?", "데이터는 어떻게 분할하는가?"에 답합니다. 여기서는 구체적인 구현보다 전체 구조와 경계에 집중합니다.

**레벨 3: 모듈/컴포넌트 레벨**  
각 서비스나 컴포넌트의 내부 구조를 설계합니다. 패키지 구조, 주요 클래스, 인터페이스를 정의합니다. "이 서비스는 어떤 레이어로 구성되는가?", "핵심 도메인 모델은 무엇인가?"를 결정합니다.

**레벨 4: 클래스/함수 레벨**  
구체적인 클래스와 함수를 설계하고 구현합니다. 메서드 시그니처, 데이터 구조, 알고리즘을 정의합니다. AI가 가장 도움이 되는 레벨이기도 합니다.

**레벨 5: 코드/구현 레벨**  
실제 코드 라인, 변수 이름, 로직 세부사항을 다룹니다. GitHub Copilot이 대부분을 생성할 수 있는 레벨입니다.

전문가는 이 레벨들을 자유롭게 오가며 사고합니다. 비즈니스 요구사항을 분석하다가(레벨 1), 시스템 구조를 구상하고(레벨 2), 특정 모듈의 설계로 내려가고(레벨 3), 다시 전체 아키텍처로 올라와 일관성을 확인합니다(레벨 2). 이러한 **수직적 사고(Vertical Thinking)**는 경험을 통해 발전하며, 시스템의 각 부분이 전체와 어떻게 연결되는지 이해하게 만듭니다.

AI와 협업할 때도 이 레벨 구분이 중요합니다. AI에게 레벨 1-2의 고수준 결정을 맡기면 안 됩니다. 그것은 여러분의 몫입니다. 반면 레벨 4-5의 구현 세부사항은 AI가 잘 처리할 수 있습니다. 레벨 3의 모듈 설계는 협업이 가장 효과적인 지점입니다. 여러분이 구조를 제안하고, AI가 구체화하며, 여러분이 검증하고 개선하는 반복적 프로세스가 최적입니다.

## 2. 개발 방법론의 패러다임 전환

### 폭포수에서 애자일로, 그리고 AI 협업으로

소프트웨어 개발 방법론은 지난 수십 년간 계속 진화해왔습니다. 각 방법론은 당시의 기술적 제약과 조직 문화를 반영하며, 새로운 패러다임은 이전 패러다임의 한계를 극복하기 위해 등장했습니다.

**폭포수 모델(Waterfall Model)**은 1970년대의 산물입니다. 요구사항 분석 → 설계 → 구현 → 테스트 → 배포의 순차적 단계를 거칩니다. 이 방법론은 제조업의 생산 라인에서 영감을 받았으며, 한 단계가 완전히 끝나야 다음 단계로 진행할 수 있습니다. 각 단계는 상세한 문서를 산출물로 남기며, 변경은 매우 비싸고 어렵습니다.

폭포수 모델의 근본적 가정은 "요구사항을 처음부터 완벽하게 파악할 수 있다"는 것입니다. 하지만 실제로는 불가능합니다. 고객도 자신이 원하는 것을 명확히 모르는 경우가 많고, 비즈니스 환경은 계속 변합니다. 6개월간 개발한 시스템이 배포 시점에는 이미 쓸모없어진 경험을 한 개발자들이 많습니다.

**애자일(Agile)**은 2001년 애자일 선언문(Agile Manifesto)과 함께 공식화되었습니다. 핵심 가치는 다음과 같습니다:

- 프로세스와 도구보다 개인과 상호작용
- 포괄적인 문서보다 작동하는 소프트웨어
- 계약 협상보다 고객과의 협업
- 계획을 따르기보다 변화에 대응

애자일은 짧은 이터레이션(보통 1-2주)으로 작동하는 소프트웨어를 지속적으로 인도합니다. 요구사항 변경을 환영하고, 고객 피드백을 빠르게 반영하며, 팀의 자율성과 책임을 강조합니다. Scrum, Kanban, XP(Extreme Programming) 등 다양한 실천 방법이 있습니다.

애자일의 성공 요소는 **빠른 피드백 루프**입니다. 고객이 실제 작동하는 소프트웨어를 보고, 피드백을 주고, 다음 이터레이션에 반영됩니다. 이는 리스크를 조기에 발견하고, 방향을 수정할 기회를 제공합니다.

**AI 협업 시대의 개발 방법론**은 또 다른 패러다임 전환을 가져옵니다. 애자일이 "어떻게 빠르게 변화에 대응할 것인가"에 초점을 맞췄다면, AI 협업은 "어떻게 더 높은 추상화 레벨에서 문제를 해결할 것인가"에 초점을 맞춥니다.

전통적 개발에서는 개발자가 요구사항을 받아 설계하고, 직접 코드를 작성하고, 테스트하고, 디버깅합니다. AI 협업에서는 개발자가 문제를 분석하고 설계하며, AI가 초안 코드를 생성하고, 개발자가 검증하고 개선하며, AI가 테스트 코드를 생성합니다. 개발자의 역할이 "코드 작성자(Coder)"에서 "설계자 겸 검증자(Designer & Reviewer)"로 이동합니다.

이는 개발 속도를 극적으로 향상시킵니다. 단순히 타이핑이 빨라지는 것이 아니라, 시행착오의 비용이 줄어듭니다. 새로운 아이디어를 프로토타입으로 만드는 시간이 며칠에서 몇 시간으로, 몇 시간에서 몇 분으로 단축됩니다. 이는 실험과 학습의 빈도를 높이고, 더 나은 솔루션을 찾을 가능성을 높입니다.

// 이미지로 교체되어야 함 : 폭포수, 애자일, AI 협업 방법론의 차이를 비교하는 타임라인 다이어그램
프롬프트: A comparative timeline diagram showing three development methodologies: Waterfall (sequential phases with documents), Agile (iterative cycles with feedback loops), and AI Collaboration (rapid prototyping with AI assistance), arrows showing evolution and key characteristics of each, modern infographic style

### TDD와 바이브 코딩의 만남

**테스트 주도 개발(Test-Driven Development, TDD)**은 켄트 벡(Kent Beck)이 제안한 개발 방법론입니다. 핵심은 간단합니다: 코드를 작성하기 전에 테스트를 먼저 작성합니다.

TDD의 3단계 사이클(Red-Green-Refactor):

**1단계: Red - 실패하는 테스트 작성**  
구현하려는 기능의 테스트를 먼저 작성합니다. 아직 코드가 없으므로 테스트는 당연히 실패합니다. 이 단계에서 여러분은 "이 기능이 어떻게 사용될 것인가"를 생각합니다. API 설계, 인터페이스, 기대 동작을 명확히 합니다.

**2단계: Green - 테스트를 통과하는 최소한의 코드 작성**  
테스트를 통과시키기 위한 코드를 작성합니다. 이 단계에서는 코드의 품질보다 "작동함"에 집중합니다. 하드코딩해도 좋고, 비효율적이어도 괜찮습니다. 일단 초록불을 켭니다.

**3단계: Refactor - 코드 개선**  
테스트가 통과하는 상태를 유지하면서 코드를 개선합니다. 중복을 제거하고, 명확하게 만들고, 효율적으로 만듭니다. 테스트가 있으므로 리팩토링 중 무언가 깨지면 즉시 알 수 있습니다.

TDD의 장점은 명확합니다:

- **설계 개선**: 테스트 가능한 코드는 결합도가 낮고 응집도가 높습니다
- **문서화**: 테스트는 코드의 사용법을 보여주는 살아있는 문서입니다
- **회귀 방지**: 새로운 변경이 기존 기능을 깨뜨리지 않음을 보장합니다
- **자신감**: 리팩토링과 변경에 대한 두려움이 줄어듭니다

하지만 TDD는 학습 곡선이 가파릅니다. 테스트를 먼저 작성하는 것이 익숙하지 않고, 무엇을 어떻게 테스트해야 할지 막막합니다. 특히 초보자에게는 코드 작성보다 테스트 작성이 더 어렵습니다.

**바이브 코딩과 TDD의 시너지**는 놀랍습니다. GitHub Copilot은 TDD의 각 단계를 가속화합니다:

**Red 단계에서:** AI에게 "이 기능을 테스트하는 코드를 작성해줘"라고 요청하면, 테스트 케이스 초안을 즉시 받습니다. 엣지 케이스를 제안받고, 테스트 구조를 배울 수 있습니다.

**Green 단계에서:** 테스트 코드를 제공하고 "이 테스트를 통과하는 구현을 만들어줘"라고 요청하면, 구현 초안을 받습니다. 여러분은 이를 검토하고 개선합니다.

**Refactor 단계에서:** "이 코드를 더 명확하게 리팩토링해줘"라고 요청하면, 개선 제안을 받습니다. 테스트가 있으므로 리팩토링 후에도 안전하게 검증할 수 있습니다.

TDD와 바이브 코딩의 결합은 개발 경험을 변화시킵니다. 테스트 작성의 어려움이 줄어들고, 빠른 피드백을 얻으며, 더 나은 설계로 이어집니다. 여러분은 "무엇을 만들 것인가"에 집중하고, AI는 "어떻게 만들 것인가"를 도와줍니다.

### 지속적 통합/배포(CI/CD)와 AI

**지속적 통합(Continuous Integration, CI)**은 개발자들이 코드를 자주(하루에 여러 번) 메인 브랜치에 통합하고, 자동화된 빌드와 테스트를 실행하는 방법입니다. 통합 문제를 조기에 발견하고, 빠르게 해결하며, 항상 배포 가능한 상태를 유지합니다.

**지속적 배포(Continuous Deployment, CD)**는 모든 변경사항이 자동으로 프로덕션에 배포되는 것을 의미합니다. (Continuous Delivery는 배포가 자동화되어 있지만 수동 승인이 필요한 경우입니다.)

CI/CD 파이프라인의 일반적인 단계:

1. **커밋**: 개발자가 코드를 버전 관리 시스템에 푸시
2. **빌드**: 코드를 컴파일하고 의존성을 해결
3. **테스트**: 단위 테스트, 통합 테스트, E2E 테스트 실행
4. **정적 분석**: 코드 품질, 보안 취약점 검사
5. **패키징**: 배포 가능한 아티팩트 생성
6. **배포**: 스테이징 환경에 배포
7. **프로덕션 배포**: 자동 또는 수동 승인 후 프로덕션에 배포

CI/CD의 핵심 가치는 **빠른 피드백과 자동화**입니다. 문제를 몇 주 후가 아니라 몇 분 안에 발견하고, 수동 작업의 실수를 제거하며, 배포의 리스크를 줄입니다.

**AI는 CI/CD 파이프라인을 여러 방식으로 강화합니다:**

**파이프라인 생성**: GitHub Copilot에게 "GitHub Actions로 CI/CD 파이프라인을 만들어줘. Node.js 프로젝트이고, 테스트와 린트를 실행하고, Docker 이미지를 빌드하고, AWS ECS에 배포해야 해"라고 요청하면, YAML 설정 파일의 초안을 받습니다.

**테스트 자동화**: AI가 테스트 코드를 생성하므로, 테스트 커버리지를 빠르게 높일 수 있습니다. 새로운 기능을 추가할 때마다 테스트도 함께 생성하여, CI에서 자동으로 실행됩니다.

**문제 진단**: 파이프라인이 실패했을 때, 에러 로그를 AI에게 제공하면 원인 분석과 해결 방법을 제안받습니다. "이 테스트 실패의 원인이 뭐야?"라고 물으면, 로그를 분석하고 가능한 원인들을 제시합니다.

**설정 최적화**: "이 빌드 시간을 줄이려면 어떻게 해야 해?"라고 물으면, 캐싱 전략, 병렬 실행, 의존성 최적화 등을 제안받습니다.

**보안 스캔**: AI는 코드의 보안 취약점을 식별하고, 수정 방법을 제안할 수 있습니다. 파이프라인에 보안 검사를 통합하여, 취약한 코드가 프로덕션에 도달하는 것을 방지합니다.

바이브 코딩 시대의 CI/CD는 단순히 자동화를 넘어, **지능적 파이프라인**으로 진화합니다. AI가 테스트를 생성하고, 문제를 진단하고, 최적화를 제안하며, 보안을 검사합니다. 개발자는 파이프라인 설정의 세부사항보다, 전체 워크플로우와 품질 기준에 집중할 수 있습니다.

## 3. AI 협업 기반 설계 패턴

### 모듈화 전략: AI가 이해할 수 있는 경계 만들기

AI와 효과적으로 협업하려면, AI가 이해하고 작업할 수 있는 명확한 경계를 만들어야 합니다. 이는 전통적인 모듈화와 비슷하지만, AI의 특성을 고려한 추가적인 고려사항이 있습니다.

**작은 단위로 분해하세요**

AI는 큰 컨텍스트보다 작고 명확한 컨텍스트에서 더 잘 작동합니다. 하나의 거대한 파일에 모든 코드를 넣는 대신, 기능별로 작은 파일로 분리하세요. 각 파일은 하나의 명확한 책임을 가져야 합니다.

예를 들어, 이커머스 시스템에서:
- `user-authentication.ts` - 사용자 인증만 담당
- `product-catalog.ts` - 상품 카탈로그 관리
- `order-processing.ts` - 주문 처리
- `payment-gateway.ts` - 결제 연동

이렇게 분리하면 AI에게 "user-authentication.ts에 소셜 로그인 기능을 추가해줘"라고 명확하게 요청할 수 있습니다. AI는 관련 없는 코드에 신경 쓰지 않고, 인증 로직에만 집중할 수 있습니다.

**명확한 인터페이스를 정의하세요**

각 모듈이 외부에 노출하는 인터페이스를 명확히 하세요. 인터페이스는 "계약"이며, AI가 이 계약을 준수하도록 요청할 수 있습니다.

```typescript
// 핵심: 인터페이스는 "무엇을"에 집중
interface PaymentGateway {
  processPayment(amount: number, method: string): Promise<PaymentResult>;
  refund(transactionId: string): Promise<RefundResult>;
  validateCard(cardNumber: string): boolean;
}
```

이제 AI에게 "PaymentGateway 인터페이스를 구현하는 StripePaymentGateway 클래스를 만들어줘"라고 요청할 수 있습니다. 인터페이스가 명확하므로, AI는 정확히 무엇을 구현해야 하는지 알고 있습니다.

📁 **전체 구현 예시**: [code/payment-gateway-interface.ts](code/payment-gateway-interface.ts)

**의존성을 명시적으로 관리하세요**

모듈 간 의존성을 명시적으로 드러내세요. 의존성 주입(Dependency Injection) 패턴을 사용하면, 각 모듈이 무엇에 의존하는지 명확하게 보입니다.

```typescript
// 핵심: 생성자에서 의존성을 명시적으로 선언
class OrderService {
  constructor(
    private paymentGateway: PaymentGateway,
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {}
  
  // async createOrder() { ... }
}
```

AI는 이 구조를 보고, `OrderService`가 세 가지 서비스에 의존한다는 것을 즉시 이해합니다. "OrderService에 배송 추적 기능을 추가해줘"라고 요청하면, AI는 어떤 의존성을 추가해야 할지도 제안할 수 있습니다.

📁 **전체 구현 예시**: [code/order-service-dependency-injection.ts](code/order-service-dependency-injection.ts)

**레이어를 명확히 분리하세요**

전통적인 레이어드 아키텍처는 AI 협업에도 효과적입니다:

- **Presentation Layer**: API 엔드포인트, 컨트롤러
- **Business Logic Layer**: 도메인 모델, 비즈니스 규칙
- **Data Access Layer**: 데이터베이스 접근, 리포지토리
- **Infrastructure Layer**: 외부 서비스 연동, 설정

각 레이어는 자신의 아래 레이어에만 의존합니다. AI에게 "Product 엔티티에 할인 가격 계산 로직을 추가해줘"라고 요청하면, AI는 Business Logic Layer의 코드만 수정하고, Presentation이나 Data Access Layer는 건드리지 않습니다.

### 인터페이스 설계: 명확한 계약 만들기

인터페이스는 모듈 간 계약입니다. 잘 설계된 인터페이스는 구현 세부사항을 숨기고, 변경에 강하며, AI가 이해하기 쉽습니다.

**목적 중심으로 설계하세요**

인터페이스는 "어떻게"가 아니라 "무엇을"에 집중해야 합니다. 구현 세부사항이 아니라, 제공하는 기능을 표현하세요.

좋지 않은 예:
```typescript
interface DatabaseConnection {
  openConnection(): void;
  executeQuery(sql: string): any;
  closeConnection(): void;
}
```

좋은 예:
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

첫 번째는 데이터베이스 연결의 구현 세부사항을 드러냅니다. 두 번째는 "사용자 저장소"라는 목적을 표현합니다. AI에게 "UserRepository를 MongoDB로 구현해줘"라고 요청하면, AI는 MongoDB 특화 구현을 제공하지만, 인터페이스는 그대로 유지됩니다. 나중에 "UserRepository를 PostgreSQL로 바꿔줘"라고 해도, 인터페이스를 사용하는 다른 코드는 변경하지 않아도 됩니다.

**작게 유지하세요 (Interface Segregation Principle)**

거대한 인터페이스 하나보다 작은 인터페이스 여러 개가 낫습니다. 클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 합니다.

```typescript
// ❌ 나쁜 예: 모든 기능이 하나의 거대한 인터페이스
interface User { /* 5개의 관련 없는 메서드 */ }

// ✅ 좋은 예: 역할별로 분리
interface Authenticatable {
  authenticate(password: string): boolean;
}

interface ProfileManager {
  updateProfile(data: ProfileData): void;
}
```

작은 인터페이스는 AI가 구현하기도 쉽고, 테스트하기도 쉽습니다. "Authenticatable 인터페이스를 OAuth로 구현해줘"는 명확한 요청이고, AI는 다른 관심사에 신경 쓰지 않고 인증에만 집중할 수 있습니다.

📁 **전체 예시**: [code/interface-segregation-principle.ts](code/interface-segregation-principle.ts)

**타입 안전성을 활용하세요**

TypeScript나 다른 정적 타입 언어를 사용한다면, 타입 시스템을 최대한 활용하세요. AI는 타입 정보를 통해 올바른 코드를 생성합니다.

```typescript
type UserId = string & { __brand: 'UserId' };
type OrderId = string & { __brand: 'OrderId' };

interface OrderService {
  createOrder(userId: UserId, items: OrderItem[]): Promise<OrderId>;
  cancelOrder(orderId: OrderId): Promise<void>;
}
```

이제 AI가 실수로 `OrderId`를 `UserId` 자리에 넣는 일이 없습니다. 타입 시스템이 계약의 일부이고, AI는 이를 준수합니다.

**문서화를 병행하세요**

인터페이스에 주석을 달아, AI가 의도를 명확히 이해하도록 하세요. 특히 복잡한 비즈니스 규칙이나 제약사항을 설명하세요.

```typescript
interface PaymentGateway {
  /**
   * 결제를 처리합니다.
   * @param amount - 결제 금액 (양수여야 함)
   * @param method - 결제 수단 ('card', 'bank', 'mobile' 중 하나)
   * @returns 결제 결과 (성공 시 transactionId 포함)
   * @throws InvalidAmountError - 금액이 0 이하인 경우
   * @throws UnsupportedMethodError - 지원하지 않는 결제 수단인 경우
   */
  processPayment(amount: number, method: string): Promise<PaymentResult>;
}
```

AI는 이 문서를 읽고, 유효성 검사를 포함하고, 적절한 에러를 던지는 구현을 만들 것입니다.

### 확장 가능한 구조: 변화에 대비하기

소프트웨어는 계속 변합니다. 새로운 기능이 추가되고, 요구사항이 바뀌며, 기술 스택이 진화합니다. 확장 가능한 구조는 이러한 변화에 유연하게 대응할 수 있도록 설계됩니다.

**개방-폐쇄 원칙(Open-Closed Principle)을 따르세요**

"확장에는 열려있고, 수정에는 닫혀있어야 한다"는 원칙입니다. 새로운 기능을 추가할 때 기존 코드를 수정하지 않고, 새로운 코드를 추가하는 방식으로 확장하세요.

```typescript
// ❌ 나쁜 방식: 새 기능 추가 시 기존 함수 수정
function processPayment(method: string, amount: number) {
  if (method === 'card') { /* ... */ }
  else if (method === 'bank') { /* ... */ }
  else if (method === 'mobile') { /* 수정! */ }
}

// ✅ 좋은 방식: 인터페이스 기반 확장
interface PaymentMethod {
  process(amount: number): Promise<PaymentResult>;
}

class CryptoPayment implements PaymentMethod {
  // 새 클래스 추가만으로 확장, 기존 코드 수정 불필요
}
```

AI에게 "새로운 PaymentMethod 구현을 추가해줘: 암호화폐 결제"라고 요청하면, AI는 기존 코드를 건드리지 않고 `CryptoPayment` 클래스만 추가합니다.

📁 **전체 구현 예시**: [code/open-closed-principle.ts](code/open-closed-principle.ts)

**플러그인 아키텍처를 고려하세요**

핵심 기능은 안정적으로 유지하고, 확장 기능은 플러그인으로 분리하세요. 이는 AI와 협업할 때 특히 효과적입니다.

```typescript
// 핵심: 플러그인 인터페이스와 매니저 구조
interface Plugin {
  name: string;
  initialize(): void;
  execute(context: PluginContext): Promise<void>;
}

class PluginManager {
  register(plugin: Plugin): void { /* ... */ }
  async executeAll(context: PluginContext): Promise<void> { /* ... */ }
}

// 사용: 새 플러그인 추가
class EmailNotificationPlugin implements Plugin { /* ... */ }
manager.register(new EmailNotificationPlugin());
```

AI에게 "이메일 알림 플러그인을 만들어줘"라고 요청하면, 핵심 시스템을 건드리지 않고 새로운 플러그인만 만듭니다.

📁 **전체 구현 예시**: [code/plugin-architecture.ts](code/plugin-architecture.ts)

**설정을 외부화하세요**

하드코딩된 값 대신 설정 파일을 사용하세요. 이는 환경별 차이(개발, 스테이징, 프로덕션)를 관리하기 쉽게 만듭니다.

```typescript
// 핵심: 타입 안전한 설정 구조
interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  database: DatabaseConfig;
  payment: PaymentConfig;
  features: FeatureFlags;
}

// 환경별 설정 분리
const developmentConfig: AppConfig = { /* 개발용 */ };
const productionConfig: AppConfig = { /* 프로덕션용 */ };
```

AI에게 "개발 환경 설정 파일을 만들어줘"라고 요청하면, 적절한 기본값을 가진 설정을 생성합니다.

📁 **전체 구현 예시**: [code/configuration-externalization.ts](code/configuration-externalization.ts)

**버전 관리를 고려하세요**

API가 외부에 노출된다면, 버전 관리를 처음부터 고려하세요. 이는 하위 호환성을 유지하면서 진화할 수 있게 합니다.

```typescript
// v1
app.get('/api/v1/users/:id', getUserV1);

// v2 - 새로운 필드 추가, 기존 v1은 유지
app.get('/api/v2/users/:id', getUserV2);
```

AI에게 "사용자 API의 v2를 만들어줘. v1에 추가로 프로필 이미지 URL을 포함해야 해"라고 요청하면, 기존 v1을 깨뜨리지 않고 v2를 만듭니다.

// 이미지로 교체되어야 함 : 확장 가능한 아키텍처 패턴을 보여주는 다이어그램 (플러그인 구조, 인터페이스 기반 설계)
프롬프트: A layered architecture diagram showing plugin-based extensible structure, core system at center, multiple plugin modules connecting through interfaces, arrows showing data flow, modern technical illustration style with clear component boundaries

## 4. 실습: GitHub Copilot을 활용한 시스템 설계 초안 작성

이제 배운 내용을 실제로 적용해봅시다. 간단한 "할 일 관리 시스템"을 설계하면서, GitHub Copilot과 협업하는 방법을 익혀보겠습니다.

### 요구사항 분석 및 도메인 모델링

**시나리오**: 팀 협업 할 일 관리 시스템을 만듭니다. 여러 사용자가 프로젝트를 만들고, 할 일을 추가하고, 담당자를 지정하고, 진행 상황을 추적할 수 있어야 합니다.

**1단계: 도메인 이벤트 식별**

GitHub Copilot Chat에 다음과 같이 요청하세요:

```
"할 일 관리 시스템에서 일어날 수 있는 주요 도메인 이벤트를 나열해줘. 
프로젝트 생성, 할 일 관리, 사용자 협업과 관련된 이벤트를 포함해."
```

Copilot이 제안할 이벤트들:
- 프로젝트가 생성됨 (ProjectCreated)
- 할 일이 추가됨 (TodoAdded)
- 할 일이 할당됨 (TodoAssigned)
- 할 일 상태가 변경됨 (TodoStatusChanged)
- 댓글이 작성됨 (CommentAdded)
- 마감일이 설정됨 (DueDateSet)
- 프로젝트가 완료됨 (ProjectCompleted)

**2단계: 핵심 엔티티 정의**

이제 엔티티와 그 관계를 정의합니다:

```
"위 이벤트들을 기반으로 핵심 엔티티와 값 객체를 정의해줘. 
TypeScript 인터페이스로 표현해줘."
```

Copilot이 생성할 모델:
```typescript
// 핵심 엔티티
interface Project {
  id: ProjectId;
  owner: UserId;
  members: UserId[];
  // ...
}

interface Todo {
  id: TodoId;
  projectId: ProjectId;
  assignee: UserId | null;
  status: TodoStatus;
  // ...
}

// 타입 안전한 값 객체
type ProjectId = string & { __brand: 'ProjectId' };
type TodoId = string & { __brand: 'TodoId' };
```

📁 **전체 도메인 모델**: [code/todo-system-design.ts](code/todo-system-design.ts)

**3단계: 도메인 규칙 명시**

비즈니스 규칙을 명확히 합니다:

```
"이 시스템의 핵심 도메인 규칙(불변 조건)을 정의해줘."
```

Copilot이 제안할 규칙들:
- 프로젝트 멤버만 할 일을 추가/수정할 수 있다
- 할 일은 프로젝트 멤버에게만 할당할 수 있다
- 완료된 프로젝트의 할 일은 수정할 수 없다
- 할 일의 마감일은 과거가 될 수 없다
- 각 할 일은 정확히 하나의 프로젝트에 속한다

### 아키텍처 초안 생성

**1단계: 레이어 구조 설계**

```
"위 도메인 모델을 기반으로 레이어드 아키텍처를 설계해줘. 
각 레이어의 책임과 주요 컴포넌트를 설명해줘."
```

Copilot이 제안할 구조:

**Presentation Layer (API)**
- `ProjectController` - 프로젝트 CRUD API
- `TodoController` - 할 일 CRUD API
- `UserController` - 사용자 인증/프로필 API

**Application Layer (Use Cases)**
- `CreateProjectUseCase` - 프로젝트 생성 로직
- `AddTodoUseCase` - 할 일 추가 로직
- `AssignTodoUseCase` - 할 일 할당 로직
- `UpdateTodoStatusUseCase` - 상태 변경 로직

**Domain Layer (Business Logic)**
- `Project` - 프로젝트 엔티티와 비즈니스 규칙
- `Todo` - 할 일 엔티티와 검증 로직
- `ProjectPolicy` - 프로젝트 관련 정책
- `TodoPolicy` - 할 일 관련 정책

**Infrastructure Layer**
- `ProjectRepository` - 프로젝트 저장소
- `TodoRepository` - 할 일 저장소
- `EventPublisher` - 이벤트 발행
- `EmailService` - 알림 발송

**2단계: 디렉토리 구조 생성**

```
"위 아키텍처를 반영하는 디렉토리 구조를 만들어줘."
```

Copilot이 제안할 구조:
```
src/
├── presentation/
│   ├── controllers/
│   │   ├── ProjectController.ts
│   │   ├── TodoController.ts
│   │   └── UserController.ts
│   └── middlewares/
│       ├── AuthMiddleware.ts
│       └── ValidationMiddleware.ts
├── application/
│   ├── use-cases/
│   │   ├── CreateProjectUseCase.ts
│   │   ├── AddTodoUseCase.ts
│   │   └── AssignTodoUseCase.ts
│   └── dto/
│       ├── CreateProjectDto.ts
│       └── AddTodoDto.ts
├── domain/
│   ├── entities/
│   │   ├── Project.ts
│   │   └── Todo.ts
│   ├── policies/
│   │   ├── ProjectPolicy.ts
│   │   └── TodoPolicy.ts
│   └── events/
│       ├── ProjectCreated.ts
│       └── TodoAssigned.ts
└── infrastructure/
    ├── repositories/
    │   ├── ProjectRepository.ts
    │   └── TodoRepository.ts
    └── services/
        ├── EventPublisher.ts
        └── EmailService.ts
```

**3단계: 핵심 인터페이스 정의**

```
"Repository 인터페이스들을 정의해줘. 
각 엔티티의 CRUD 작업과 특화된 쿼리를 포함해."
```

Copilot이 생성할 인터페이스:
```typescript
// 핵심: 도메인 중심의 Repository 인터페이스
interface ProjectRepository {
  findById(id: ProjectId): Promise<Project | null>;
  findByMember(userId: UserId): Promise<Project[]>;
  save(project: Project): Promise<void>;
  // ...
}

interface TodoRepository {
  findById(id: TodoId): Promise<Todo | null>;
  findByProject(projectId: ProjectId): Promise<Todo[]>;
  findOverdue(): Promise<Todo[]>;  // 도메인 특화 쿼리
  // ...
}
```

📁 **전체 인터페이스 정의**: [code/todo-system-design.ts](code/todo-system-design.ts)

### 설계 검증 및 개선

**1단계: Use Case 구현 검증**

하나의 Use Case를 AI에게 구현하도록 하고, 설계의 타당성을 검증합니다:

```
"AssignTodoUseCase를 구현해줘. 
도메인 규칙을 검증하고, 이벤트를 발행하고, 알림을 보내는 로직을 포함해."
```

Copilot이 생성할 코드:
```typescript
// 핵심: Use Case 구조 - 의존성 주입과 비즈니스 흐름
class AssignTodoUseCase {
  constructor(
    private todoRepository: TodoRepository,
    private projectRepository: ProjectRepository,
    private eventPublisher: EventPublisher,
    private emailService: EmailService
  ) {}

  async execute(todoId: TodoId, assigneeId: UserId): Promise<void> {
    // 1. 데이터 조회
    const todo = await this.todoRepository.findById(todoId);
    const project = await this.projectRepository.findById(todo.projectId);

    // 2. 도메인 규칙 검증
    if (!project.members.includes(assigneeId)) {
      throw new NotProjectMemberError(assigneeId, project.id);
    }

    // 3. 비즈니스 로직 실행
    todo.assignee = assigneeId;
    await this.todoRepository.save(todo);

    // 4. 이벤트 발행 및 알림
    await this.eventPublisher.publish(new TodoAssigned(todoId, assigneeId));
    await this.emailService.sendAssignmentNotification(assigneeId, todo);
  }
}
```

📁 **전체 Use Case 구현**: [code/todo-system-design.ts](code/todo-system-design.ts)

**2단계: 설계 개선 요청**

생성된 코드를 보고 개선점을 찾아 요청합니다:

```
"이 코드에서 개선할 수 있는 부분을 제안해줘. 
성능, 트랜잭션 처리, 에러 처리 관점에서 검토해줘."
```

Copilot이 제안할 개선사항:
- 트랜잭션 처리 추가 (저장 실패 시 이벤트/알림 방지)
- 동시성 제어 (낙관적 잠금)
- 재시도 로직 (외부 서비스 실패 시)
- 로깅 추가 (디버깅용)

**3단계: 테스트 코드 생성**

```
"AssignTodoUseCase의 단위 테스트를 작성해줘. 
정상 케이스와 에러 케이스를 모두 포함해."
```

Copilot이 생성할 테스트:
```typescript
// 핵심: Given-When-Then 패턴으로 명확한 테스트
describe('AssignTodoUseCase', () => {
  it('should assign todo to project member', async () => {
    // Given: 프로젝트 멤버가 있고
    const project = createProject({ members: [userId1, userId2] });
    const todo = createTodo({ projectId: project.id });
    
    // When: 멤버에게 할 일을 할당하면
    await useCase.execute(todo.id, userId2);
    
    // Then: 할당되어야 함
    expect(todo.assignee).toBe(userId2);
  });

  it('should throw error when assigning to non-member', async () => {
    // 도메인 규칙 위반 시 에러 발생 검증
    await expect(useCase.execute(todo.id, nonMemberId))
      .rejects.toThrow(NotProjectMemberError);
  });

  it('should throw error when assigning to non-member', async () => {
    // Given: 프로젝트 멤버가 아닌 사용자에게
    const project = createProject({ members: [userId1] });
    const todo = createTodo({ projectId: project.id });
    
    // When: 할 일을 할당하려고 하면
    // Then: 에러가 발생해야 함
    await expect(useCase.execute(todo.id, userId2))
      .rejects.toThrow(NotProjectMemberError);
  });
});
```

이 실습을 통해 여러분은 GitHub Copilot과 협업하여 시스템 설계를 빠르게 초안 작성하고, 검증하고, 개선하는 방법을 익혔습니다. AI는 반복적인 작업을 처리하고, 여러분은 설계의 품질과 비즈니스 로직의 정확성에 집중할 수 있습니다.

## 5. 실습 결과 요약

이번 주차에서 우리는 고급 컴퓨팅 사고와 AI 시대의 소프트웨어 아키텍처를 학습했습니다. 배운 내용을 정리하면서, 실무에서 어떻게 적용할 수 있는지 살펴봅시다.

### 핵심 학습 내용

**문제 공간과 솔루션 공간의 분리**

전문 개발자는 "무엇을 해결할 것인가"(문제 공간)와 "어떻게 해결할 것인가"(솔루션 공간)를 명확히 구분합니다. 문제 도메인을 깊이 이해하고, 비즈니스 규칙과 제약사항을 파악한 후, 적절한 아키텍처 스타일과 기술 스택을 선택합니다. GitHub Copilot은 솔루션 공간에서 강력하지만, 문제 공간의 분석은 여러분의 몫입니다.

**다중 추상화 레벨 사고**

복잡한 시스템을 설계하려면 비즈니스 레벨에서 코드 레벨까지 여러 추상화 레벨을 자유롭게 오가며 사고해야 합니다. 각 레벨은 서로 다른 관심사를 가지며, 레벨 간 일관성을 유지하는 것이 중요합니다. AI와 협업할 때도 이 구분이 중요합니다. 고수준 설계는 여러분이, 저수준 구현은 AI가 담당하는 역할 분담이 효과적입니다.

**개발 방법론의 진화**

폭포수에서 애자일로, 그리고 AI 협업으로의 전환은 단순한 프로세스 변화가 아니라 개발자의 역할 변화를 의미합니다. 여러분은 코드 작성자에서 설계자이자 검증자로 진화합니다. TDD와 CI/CD 같은 검증된 방법론은 AI 협업과 만나 더욱 강력해집니다. 테스트 작성이 쉬워지고, 파이프라인 구성이 간단해지며, 문제 진단이 빨라집니다.

**모듈화와 인터페이스 설계**

AI가 이해하고 작업할 수 있는 명확한 경계를 만드는 것이 협업의 핵심입니다. 작은 단위로 분해하고, 명확한 인터페이스를 정의하며, 의존성을 명시적으로 관리하세요. 잘 설계된 모듈은 AI가 독립적으로 작업할 수 있는 단위가 되고, 인터페이스는 AI가 준수해야 할 계약이 됩니다.

**확장 가능한 구조**

소프트웨어는 계속 변합니다. 개방-폐쇄 원칙을 따르고, 플러그인 아키텍처를 고려하며, 설정을 외부화하고, 버전 관리를 계획하세요. 이러한 구조는 새로운 기능 추가 시 기존 코드 수정을 최소화하고, AI와의 협업을 더 안전하게 만듭니다.

### 실무 적용 가이드

**1단계: 작게 시작하기**

모든 프로젝트를 처음부터 완벽한 아키텍처로 시작할 필요는 없습니다. 핵심 도메인을 명확히 하고, 간단한 레이어 구조로 시작하세요. GitHub Copilot과 협업하여 빠르게 프로토타입을 만들고, 실제로 작동하는 것을 확인한 후, 점진적으로 구조를 개선하세요.

**2단계: 인터페이스 우선 접근**

코드를 작성하기 전에 주요 인터페이스를 먼저 정의하세요. "어떤 모듈이 필요한가?", "각 모듈의 책임은 무엇인가?", "모듈 간 어떻게 통신하는가?"를 먼저 결정하세요. 인터페이스가 명확하면, AI에게 구현을 맡기기 쉬워집니다.

**3단계: 반복적 개선**

첫 번째 설계가 완벽할 필요는 없습니다. AI가 생성한 코드를 검토하고, 문제점을 발견하고, 개선을 요청하세요. "이 코드의 테스트 커버리지를 높여줘", "이 부분의 성능을 개선해줘", "에러 처리를 강화해줘"와 같은 반복적 개선이 좋은 결과를 만듭니다.

**4단계: 문서화와 커뮤니케이션**

설계 의도를 명확히 문서화하세요. 주석, README, 아키텍처 다이어그램 등을 통해 "왜 이렇게 설계했는가"를 설명하세요. 이는 팀원에게도 유용하지만, AI와의 협업에서도 중요합니다. AI는 컨텍스트를 이해할 때 더 나은 코드를 생성합니다.

**5단계: 지속적 학습**

소프트웨어 아키텍처는 계속 진화합니다. 새로운 패턴, 새로운 도구, 새로운 방법론을 배우세요. GitHub Copilot에게 "최신 Node.js 마이크로서비스 아키텍처 패턴을 보여줘"라고 물어보고, 제안된 패턴을 학습하고 적용해보세요. AI는 훌륭한 학습 파트너입니다.

### 다음 주 예고

4주차에는 **"바이브 코딩 실전: 프로젝트 시작부터 배포까지"**를 다룹니다. 실제 프로젝트를 처음부터 끝까지 만들면서, GitHub Copilot과의 협업 워크플로우를 완성합니다. 프로젝트 초기 설정, 기능 개발, 테스트, 배포까지 전 과정에서 AI를 효과적으로 활용하는 방법을 배웁니다.

여러분은 이제 문제를 분석하고, 구조를 설계하고, AI와 협업하여 구현하는 전문가의 사고방식을 갖추었습니다. 다음 주에는 이를 실전에 적용하며 더욱 발전시킬 것입니다.
