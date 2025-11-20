# 12주차: 최종 프로젝트 I - 기획 및 설계

## 개요

15주 과정의 하이라이트인 최종 프로젝트가 시작됩니다. 지금까지 배운 모든 것을 통합하는 시간입니다. 컴퓨팅 사고의 4대 원리, GitHub Copilot과의 협업 기법, 아키텍처 설계 원칙, 바이브 코딩 실전 전략까지. 이 모든 학습의 결정체를 만들어봅니다.

12주차에서는 프로젝트의 기획과 설계에 집중합니다. 좋은 설계는 구현의 절반입니다. 명확한 문제 정의와 체계적인 분해, 그리고 적절한 추상화가 이루어지면 GitHub Copilot은 여러분의 생각을 코드로 빠르게 구현해줄 것입니다.

### 학습 목표

**1. 실전 문제 발견 및 정의 능력**
- 비즈니스 가치가 있는 문제를 발굴하고 명확히 정의
- 사용자 요구사항을 기능 명세로 전환
- 프로젝트 범위와 우선순위 설정

**2. 컴퓨팅 사고의 통합 적용**
- 문제를 관리 가능한 단위로 분해
- 재사용 가능한 패턴 식별
- 계층적 추상화 설계
- 효율적인 알고리즘 선정

**3. 실전 아키텍처 설계**
- Clean Architecture 기반 시스템 구조 설계
- 기술 스택 선정 및 정당화
- 데이터베이스 스키마 설계
- API 설계 및 인터페이스 정의

**4. AI 협업 전략 수립**
- 프로젝트 단계별 GitHub Copilot 활용 계획
- 효과적인 프롬프트 작성 전략
- 코드 생성 및 검증 워크플로우
- 팀 협업 시나리오 (선택)

이번 주차를 마치면 단순히 코드를 작성하는 개발자가 아니라, 문제를 설계하고 시스템을 구상하는 소프트웨어 엔지니어로 한 걸음 더 나아갈 수 있습니다.

## 1. 최종 프로젝트 주제 선정 및 문제 정의

좋은 프로젝트는 명확한 문제 정의에서 시작됩니다. 기술을 위한 기술이 아니라, 실제 가치를 창출하는 솔루션을 만들어야 합니다.

### 1.1 프로젝트 아이디어 발굴

**실전 문제 찾기:**

좋은 프로젝트 주제는 다음 조건을 만족합니다:

1. **실제 불편함을 해결**: 여러분 또는 주변 사람들이 겪는 실제 문제
2. **명확한 사용자**: 누가 사용할지 명확함
3. **측정 가능한 가치**: 얼마나 개선되는지 측정 가능
4. **구현 가능한 범위**: 3주 안에 MVP 완성 가능
5. **학습 요소 포함**: 새로운 기술이나 패턴 학습 기회

**프로젝트 주제 예시:**

```markdown
# 주제 1: 스마트 할 일 관리 시스템
- 문제: 기존 TODO 앱은 우선순위와 시간 추정이 어려움
- 해결: AI 기반 작업 분해 및 시간 추정, 자동 일정 조정
- 사용자: 프로젝트 매니저, 개발자, 학생
- 가치: 생산성 20% 향상, 마감 준수율 증가
- 기술: NestJS, TypeScript, PostgreSQL, OpenAI API

# 주제 2: 코드 리뷰 도우미
- 문제: 코드 리뷰 시 놓치는 보안/성능 이슈
- 해결: 자동화된 정적 분석 + AI 리뷰 코멘트 생성
- 사용자: 개발 팀, 오픈소스 프로젝트
- 가치: 리뷰 시간 50% 단축, 버그 조기 발견
- 기술: GitHub API, ASP.NET Core, Azure DevOps

# 주제 3: 실시간 협업 문서 편집기
- 문제: 기술 문서 작성 시 협업과 버전 관리 어려움
- 해결: 실시간 동시 편집 + Git 버전 관리 통합
- 사용자: 기술 문서 작성 팀
- 가치: 협업 효율성 향상, 문서 품질 개선
- 기술: WebSocket, CRDT, Express.js, MongoDB
```

### 1.2 문제 정의 프레임워크

**5W1H 분석:**

명확한 문제 정의를 위해 다음 질문에 답합니다:

```typescript
interface ProblemDefinition {
  // What: 무엇이 문제인가?
  problem: {
    current: string;      // 현재 상황
    pain: string;         // 주요 불편 사항
    impact: string;       // 영향 범위
  };
  
  // Who: 누가 이 문제를 겪는가?
  users: {
    primary: string;      // 주 사용자
    secondary?: string;   // 부 사용자
    personas: Persona[];  // 사용자 페르소나
  };
  
  // Why: 왜 이 문제를 해결해야 하는가?
  value: {
    business: string;     // 비즈니스 가치
    user: string;         // 사용자 가치
    learning: string;     // 학습 가치
  };
  
  // When: 언제 이 문제가 발생하는가?
  context: {
    frequency: string;    // 발생 빈도
    scenario: string[];   // 구체적 상황
  };
  
  // Where: 어디서 사용되는가?
  environment: {
    platform: string[];   // 플랫폼 (Web, Mobile, Desktop)
    deployment: string;   // 배포 환경
  };
  
  // How: 어떻게 해결할 것인가?
  solution: {
    approach: string;     // 해결 방법
    differentiation: string; // 차별점
    constraints: string[]; // 제약 조건
  };
}
```

**실전 예시: 스마트 할 일 관리 시스템**

```typescript
const smartTodoDefinition: ProblemDefinition = {
  problem: {
    current: "현재 TODO 앱은 단순 목록 관리만 가능하고, 복잡한 프로젝트의 작업 분해와 시간 관리가 어렵다",
    pain: "큰 작업을 어떻게 나눌지 모르고, 예상 시간이 부정확해 일정이 자주 지연된다",
    impact: "프로젝트 지연, 스트레스 증가, 생산성 저하"
  },
  
  users: {
    primary: "프로젝트를 관리하는 개발자, PM",
    secondary: "팀으로 협업하는 모든 지식 근로자",
    personas: [
      {
        name: "김개발 (시니어 개발자)",
        goal: "복잡한 기능을 구현 가능한 단위로 분해하고 정확한 일정 예측",
        pain: "작업 분해에 시간이 오래 걸리고, 예상 시간이 자주 틀림"
      },
      {
        name: "박매니저 (프로젝트 매니저)",
        goal: "팀원들의 작업 진행률 실시간 파악 및 병목 지점 조기 발견",
        pain: "작업 현황 파악을 위해 매번 회의 필요"
      }
    ]
  },
  
  value: {
    business: "프로젝트 납기 준수율 향상, 리소스 활용 최적화",
    user: "작업 계획 수립 시간 70% 단축, 일정 예측 정확도 향상",
    learning: "AI API 통합, 복잡한 상태 관리, 실시간 협업 기능 구현"
  },
  
  context: {
    frequency: "매일 사용, 작업 시작 전과 진행 중 수시로 확인",
    scenario: [
      "새 프로젝트 시작 시 작업 분해",
      "일일 스탠드업 전 진행률 확인",
      "병목 발견 시 작업 재배치"
    ]
  },
  
  environment: {
    platform: ["Web", "Mobile (PWA)"],
    deployment: "클라우드 (AWS/Azure), Docker 컨테이너"
  },
  
  solution: {
    approach: "AI를 활용한 자동 작업 분해 + 데이터 기반 시간 예측 + 실시간 협업",
    differentiation: "기존 TODO 앱과 달리 AI가 작업을 컴퓨팅 사고 원리로 분해하고 과거 데이터로 시간 예측",
    constraints: [
      "MVP는 3주 내 완성",
      "OpenAI API 비용 월 $50 이하",
      "동시 사용자 100명까지 지원"
    ]
  }
};
```

### 1.3 요구사항 정의

**기능 요구사항 (Functional Requirements):**

```markdown
# 필수 기능 (Must Have)
1. 사용자 인증
   - 이메일 회원가입 및 로그인
   - OAuth (Google, GitHub)
   - JWT 기반 세션 관리

2. 작업 관리
   - 작업 생성, 수정, 삭제
   - 상태 관리 (TODO, IN_PROGRESS, DONE)
   - 우선순위 설정
   - 마감일 설정

3. AI 기반 작업 분해
   - 복잡한 작업을 하위 작업으로 자동 분해
   - 각 하위 작업의 예상 시간 추정
   - 분해 결과 수정 가능

4. 대시보드
   - 오늘 할 작업 목록
   - 진행률 시각화
   - 마감 임박 작업 알림

# 선택 기능 (Should Have)
5. 팀 협업
   - 작업 공유 및 할당
   - 댓글 및 멘션
   - 실시간 동기화

6. 통계 및 분석
   - 생산성 트렌드
   - 예상 vs 실제 시간 비교
   - 작업 패턴 분석

# 미래 기능 (Nice to Have)
7. 캘린더 통합 (Google Calendar)
8. 모바일 푸시 알림
9. 음성 명령 작업 추가
```

**비기능 요구사항 (Non-Functional Requirements):**

```markdown
# 성능
- API 응답 시간: 평균 200ms 이하
- 페이지 로딩 시간: 2초 이내
- 동시 사용자: 100명 지원

# 보안
- HTTPS 필수
- 비밀번호 해싱 (bcrypt)
- SQL Injection 방지
- XSS 방지
- CSRF 토큰

# 확장성
- 수평적 확장 가능한 아키텍처
- 데이터베이스 인덱싱 최적화
- 캐싱 전략 (Redis)

# 유지보수성
- TypeScript 100% 적용
- 단위 테스트 커버리지 80% 이상
- API 문서 자동 생성 (Swagger)
- 로깅 및 모니터링

# 사용성
- 반응형 디자인
- 접근성 (WCAG 2.1 Level AA)
- 다국어 지원 (한국어, 영어)
```

// 이미지로 교체되어야 함 : 프로젝트 기획 프로세스 - 문제 발견 → 5W1H 분석 → 요구사항 정의 → 우선순위 설정의 흐름을 보여주는 다이어그램
프롬프트: A professional project planning process flowchart with 4 sequential stages connected by arrows: 1) Problem Discovery (lightbulb icon with magnifying glass), 2) 5W1H Analysis (circular diagram with Who/What/When/Where/Why/How segments), 3) Requirements Definition (document with checklist), 4) Priority Setting (three-level pyramid with Must/Should/Nice labels). Blue gradient colors, clean modern business style, white background.

## 2. 컴퓨팅 사고를 적용한 문제 분석

이제 정의된 문제를 컴퓨팅 사고의 4대 원리로 분석합니다. 이 과정이 철저할수록 구현은 쉬워집니다.

### 2.1 분해 (Decomposition): 시스템을 모듈로 나누기

**Top-Down 접근:**

```typescript
// 레벨 0: 전체 시스템
"스마트 할 일 관리 시스템"

// 레벨 1: 주요 도메인
├─ "사용자 관리"
├─ "작업 관리"
├─ "AI 분석 엔진"
├─ "협업 기능"
└─ "대시보드"

// 레벨 2: 하위 모듈 (작업 관리 예시)
"작업 관리"
├─ "작업 CRUD"
│  ├─ 작업 생성
│  ├─ 작업 조회
│  ├─ 작업 수정
│  └─ 작업 삭제
├─ "상태 관리"
│  ├─ 상태 전이 (TODO → IN_PROGRESS → DONE)
│  ├─ 상태 변경 이력 추적
│  └─ 상태 변경 알림
├─ "작업 분해"
│  ├─ AI 기반 자동 분해
│  ├─ 수동 하위 작업 추가
│  └─ 작업 계층 관리
└─ "시간 추정"
   ├─ AI 기반 예상 시간 계산
   ├─ 실제 소요 시간 기록
   └─ 정확도 학습

// 레벨 3: 세부 기능 (AI 기반 자동 분해 예시)
"AI 기반 자동 분해"
├─ 작업 설명 분석 (NLP)
├─ 유사 작업 패턴 검색
├─ 하위 작업 후보 생성
├─ 사용자 피드백 수집
└─ 학습 데이터 축적
```

**도메인 주도 설계 (DDD) 적용:**

```typescript
// Domain: 작업 관리의 핵심 도메인 모델
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  estimatedHours: number;
  actualHours?: number;
  dueDate?: Date;
  parentTaskId?: string;
  assigneeId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED'
}

enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

// Aggregate Root
class TaskAggregate {
  private task: Task;
  private subTasks: Task[] = [];
  
  // 비즈니스 로직
  startWork(): void {
    if (this.task.status !== TaskStatus.TODO) {
      throw new Error('작업을 시작할 수 없는 상태입니다');
    }
    this.task.status = TaskStatus.IN_PROGRESS;
    this.task.updatedAt = new Date();
  }
  
  complete(): void {
    // 모든 하위 작업이 완료되어야 완료 가능
    const allSubTasksDone = this.subTasks.every(
      sub => sub.status === TaskStatus.DONE
    );
    
    if (!allSubTasksDone) {
      throw new Error('하위 작업이 모두 완료되지 않았습니다');
    }
    
    this.task.status = TaskStatus.DONE;
    this.task.updatedAt = new Date();
  }
  
  decompose(subTaskTitles: string[]): void {
    // AI 제안 또는 수동 분해
    subTaskTitles.forEach(title => {
      this.subTasks.push({
        id: generateId(),
        title,
        description: '',
        status: TaskStatus.TODO,
        priority: this.task.priority,
        estimatedHours: 0,
        parentTaskId: this.task.id,
        assigneeId: this.task.assigneeId,
        tags: [...this.task.tags],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }
}
```

### 2.2 패턴 인식 (Pattern Recognition): 재사용 가능한 패턴 찾기

**공통 패턴 식별:**

```typescript
// 패턴 1: CRUD 패턴 (모든 엔티티에 공통)
interface CrudOperations<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// 패턴 2: 상태 기계 패턴 (작업 상태 전이)
class TaskStateMachine {
  private transitions: Map<TaskStatus, TaskStatus[]> = new Map([
    [TaskStatus.TODO, [TaskStatus.IN_PROGRESS, TaskStatus.ARCHIVED]],
    [TaskStatus.IN_PROGRESS, [TaskStatus.BLOCKED, TaskStatus.DONE, TaskStatus.TODO]],
    [TaskStatus.BLOCKED, [TaskStatus.IN_PROGRESS, TaskStatus.TODO]],
    [TaskStatus.DONE, [TaskStatus.ARCHIVED]],
    [TaskStatus.ARCHIVED, []]
  ]);
  
  canTransition(from: TaskStatus, to: TaskStatus): boolean {
    return this.transitions.get(from)?.includes(to) ?? false;
  }
  
  transition(task: Task, to: TaskStatus): Task {
    if (!this.canTransition(task.status, to)) {
      throw new Error(`Cannot transition from ${task.status} to ${to}`);
    }
    return { ...task, status: to, updatedAt: new Date() };
  }
}

// 패턴 3: 옵저버 패턴 (실시간 동기화)
interface TaskObserver {
  onTaskCreated(task: Task): void;
  onTaskUpdated(task: Task): void;
  onTaskDeleted(taskId: string): void;
}

class TaskEventEmitter {
  private observers: TaskObserver[] = [];
  
  subscribe(observer: TaskObserver): void {
    this.observers.push(observer);
  }
  
  notifyCreated(task: Task): void {
    this.observers.forEach(obs => obs.onTaskCreated(task));
  }
  
  notifyUpdated(task: Task): void {
    this.observers.forEach(obs => obs.onTaskUpdated(task));
  }
}

// 패턴 4: Repository 패턴 (데이터 접근 추상화)
interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  findByStatus(status: TaskStatus): Promise<Task[]>;
  findOverdue(): Promise<Task[]>;
  delete(id: string): Promise<void>;
}
```

**AI 활용 패턴:**

```typescript
// AI 서비스 공통 인터페이스
interface AIService {
  analyze<TInput, TOutput>(input: TInput): Promise<TOutput>;
  learn(feedback: Feedback): Promise<void>;
}

// 작업 분해 AI 서비스
class TaskDecompositionAI implements AIService {
  async analyze(input: {
    taskDescription: string;
    context?: string;
  }): Promise<{
    suggestedSubTasks: string[];
    estimatedHours: number[];
    confidence: number;
  }> {
    // OpenAI API 호출 (프롬프트 엔지니어링)
    const prompt = `
작업을 구현 가능한 단위로 분해해주세요:

작업 설명: ${input.taskDescription}
컨텍스트: ${input.context || '없음'}

다음 원칙을 따라주세요:
1. 각 하위 작업은 4-8시간 내 완료 가능해야 함
2. 의존성이 명확해야 함
3. 테스트 가능해야 함
4. 구체적이고 액션 중심이어야 함

JSON 형식으로 응답:
{
  "subTasks": ["작업1", "작업2", ...],
  "estimatedHours": [2, 4, ...],
  "reasoning": "분해 근거"
}
    `.trim();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      suggestedSubTasks: result.subTasks,
      estimatedHours: result.estimatedHours,
      confidence: 0.85 // 모델 신뢰도
    };
  }
  
  async learn(feedback: {
    taskId: string;
    acceptedSuggestions: string[];
    rejectedSuggestions: string[];
    actualHours: number[];
  }): Promise<void> {
    // 학습 데이터 저장 (향후 fine-tuning에 활용)
    await this.feedbackRepository.save(feedback);
  }
}
```

### 2.3 추상화 (Abstraction): 계층 구조 설계

**Clean Architecture 레이어:**

```typescript
// ============================================
// Layer 1: Domain (핵심 비즈니스 로직)
// ============================================
// 외부 의존성 없음, 순수 TypeScript

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public status: TaskStatus,
    // ... 기타 속성
  ) {}
  
  // 도메인 로직
  canBeCompleted(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }
}

export interface ITaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
}

// ============================================
// Layer 2: Application (유스케이스)
// ============================================
// Domain에만 의존

export class CreateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private aiService: IAIService
  ) {}
  
  async execute(input: CreateTaskInput): Promise<Task> {
    // 1. 비즈니스 규칙 검증
    if (!input.title || input.title.length < 3) {
      throw new ValidationException('제목은 3자 이상이어야 합니다');
    }
    
    // 2. 도메인 객체 생성
    const task = new Task(
      generateId(),
      input.title,
      TaskStatus.TODO
    );
    
    // 3. AI 분해 제안 (선택적)
    if (input.autoDecompose) {
      const suggestions = await this.aiService.analyze({
        taskDescription: input.title
      });
      // suggestions 처리...
    }
    
    // 4. 저장
    return await this.taskRepository.save(task);
  }
}

// ============================================
// Layer 3: Infrastructure (구현 세부사항)
// ============================================
// 외부 라이브러리, DB, API 등

export class PostgresTaskRepository implements ITaskRepository {
  constructor(private db: Database) {}
  
  async save(task: Task): Promise<Task> {
    const result = await this.db.query(
      'INSERT INTO tasks (id, title, status) VALUES ($1, $2, $3) RETURNING *',
      [task.id, task.title, task.status]
    );
    return this.mapToTask(result.rows[0]);
  }
  
  async findById(id: string): Promise<Task | null> {
    const result = await this.db.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapToTask(result.rows[0]) : null;
  }
  
  private mapToTask(row: any): Task {
    return new Task(row.id, row.title, row.status);
  }
}

// ============================================
// Layer 4: Presentation (API/UI)
// ============================================
// HTTP, WebSocket 등

@Controller('/api/tasks')
export class TaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}
  
  @Post()
  async createTask(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.createTaskUseCase.execute({
      title: dto.title,
      description: dto.description,
      autoDecompose: dto.autoDecompose ?? false
    });
    
    return this.mapToDto(task);
  }
}
```

### 2.4 알고리즘 설계 (Algorithmic Thinking): 효율적인 로직

**핵심 알고리즘 설계:**

```typescript
// 알고리즘 1: 작업 우선순위 계산
class TaskPriorityCalculator {
  calculate(task: Task): number {
    // 점수가 높을수록 우선순위 높음
    let score = 0;
    
    // 1. 긴급도 (마감일까지 남은 시간)
    if (task.dueDate) {
      const daysLeft = differenceInDays(task.dueDate, new Date());
      if (daysLeft < 0) score += 100; // 마감 지남
      else if (daysLeft === 0) score += 90; // 오늘까지
      else if (daysLeft === 1) score += 70; // 내일까지
      else if (daysLeft <= 3) score += 50;
      else if (daysLeft <= 7) score += 30;
    }
    
    // 2. 중요도 (명시적 우선순위)
    const priorityWeight = {
      [Priority.CRITICAL]: 40,
      [Priority.HIGH]: 30,
      [Priority.MEDIUM]: 15,
      [Priority.LOW]: 5
    };
    score += priorityWeight[task.priority];
    
    // 3. 의존성 (다른 작업이 대기 중)
    const blockingTasksCount = this.getBlockingTasksCount(task.id);
    score += blockingTasksCount * 10;
    
    // 4. 예상 시간 (짧은 작업 우선 - Quick Win)
    if (task.estimatedHours <= 2) score += 15;
    else if (task.estimatedHours <= 4) score += 10;
    
    return score;
  }
  
  // 시간 복잡도: O(n log n)
  sortByPriority(tasks: Task[]): Task[] {
    return tasks
      .map(task => ({
        task,
        priority: this.calculate(task)
      }))
      .sort((a, b) => b.priority - a.priority)
      .map(item => item.task);
  }
}

// 알고리즘 2: 작업 일정 자동 배치
class TaskScheduler {
  // 제약 조건:
  // 1. 하루 8시간 작업 가능
  // 2. 마감일 준수
  // 3. 의존성 있는 작업은 순차 실행
  
  schedule(tasks: Task[], startDate: Date): Map<string, Date> {
    const schedule = new Map<string, Date>();
    const sortedTasks = this.topologicalSort(tasks); // 의존성 순서
    
    let currentDate = startDate;
    let dailyHours = 0;
    
    for (const task of sortedTasks) {
      // 하루 8시간 초과 시 다음 날로
      if (dailyHours + task.estimatedHours > 8) {
        currentDate = addDays(currentDate, 1);
        dailyHours = 0;
      }
      
      // 마감일 체크
      if (task.dueDate && currentDate > task.dueDate) {
        throw new Error(`작업 ${task.title}의 일정을 맞출 수 없습니다`);
      }
      
      schedule.set(task.id, currentDate);
      dailyHours += task.estimatedHours;
    }
    
    return schedule;
  }
  
  // 위상 정렬: 의존성 있는 작업을 올바른 순서로
  private topologicalSort(tasks: Task[]): Task[] {
    const graph = this.buildDependencyGraph(tasks);
    const sorted: Task[] = [];
    const visited = new Set<string>();
    
    const dfs = (taskId: string) => {
      if (visited.has(taskId)) return;
      visited.add(taskId);
      
      const dependencies = graph.get(taskId) || [];
      dependencies.forEach(dfs);
      
      const task = tasks.find(t => t.id === taskId);
      if (task) sorted.push(task);
    };
    
    tasks.forEach(task => dfs(task.id));
    return sorted;
  }
}
```

// 이미지로 교체되어야 함 : 컴퓨팅 사고 4대 원리 통합 다이어그램 - 중앙에 프로젝트, 주변에 분해/패턴/추상화/알고리즘이 연결된 구조
프롬프트: A circular integration diagram showing project at center surrounded by 4 connected principles: Decomposition (tree structure icon), Pattern Recognition (puzzle pieces icon), Abstraction (layered pyramid icon), Algorithmic Thinking (flowchart icon). Each principle has arrows pointing to the center. Colorful gradient (blue, green, orange, purple), modern infographic style, white background.

## 3. 아키텍처 설계 및 기술 스택 선정

체계적인 문제 분석이 끝났다면, 이제 최적의 기술 스택과 아키텍처를 선택합니다.

### 3.1 시스템 아키텍처 설계

**전체 시스템 구조:**

```typescript
// 마이크로서비스 vs 모놀리식
// MVP 단계에서는 모놀리식 선택 (빠른 개발, 배포 간소화)
// 추후 필요시 마이크로서비스로 전환

/**
 * 시스템 아키텍처 개요
 * 
 * ┌─────────────────┐
 * │   Client (SPA)  │  React/Vue/Svelte
 * └────────┬────────┘
 *          │ HTTPS
 *          ▼
 * ┌─────────────────┐
 * │   API Gateway   │  NestJS/Express
 * │   + Auth Guard  │
 * └────────┬────────┘
 *          │
 *     ┌────┴────┬────────────┬─────────────┐
 *     ▼         ▼            ▼             ▼
 * ┌───────┐ ┌───────┐  ┌──────────┐  ┌─────────┐
 * │ Auth  │ │ Task  │  │ AI       │  │ Collab  │
 * │Service│ │Service│  │ Service  │  │ Service │
 * └───┬───┘ └───┬───┘  └────┬─────┘  └────┬────┘
 *     │         │           │             │
 *     └────┬────┴───────────┴─────────────┘
 *          ▼
 *    ┌──────────────┐       ┌──────────┐
 *    │  PostgreSQL  │       │  Redis   │
 *    │  (Main DB)   │       │ (Cache)  │
 *    └──────────────┘       └──────────┘
 *          │
 *          ▼
 *    ┌──────────────┐
 *    │ External APIs│
 *    │ - OpenAI     │
 *    │ - SendGrid   │
 *    └──────────────┘
 */
```

**Clean Architecture 레이어 구조:**

```
src/
├── domain/                    # 핵심 비즈니스 로직 (순수 TypeScript)
│   ├── entities/
│   │   ├── Task.ts
│   │   ├── User.ts
│   │   └── Project.ts
│   ├── value-objects/
│   │   ├── Email.ts
│   │   └── Priority.ts
│   └── repositories/          # 인터페이스만 (구현 X)
│       ├── ITaskRepository.ts
│       └── IUserRepository.ts
│
├── application/               # 유스케이스 (비즈니스 규칙)
│   ├── use-cases/
│   │   ├── task/
│   │   │   ├── CreateTask.usecase.ts
│   │   │   ├── DecomposeTask.usecase.ts
│   │   │   └── CompleteTask.usecase.ts
│   │   └── user/
│   │       ├── RegisterUser.usecase.ts
│   │       └── Login.usecase.ts
│   ├── services/              # 도메인 서비스
│   │   ├── TaskPriorityCalculator.ts
│   │   └── TaskScheduler.ts
│   └── dto/
│       ├── CreateTaskDto.ts
│       └── TaskResponseDto.ts
│
├── infrastructure/            # 구현 세부사항
│   ├── database/
│   │   ├── repositories/      # Repository 구현
│   │   │   ├── PostgresTaskRepository.ts
│   │   │   └── PostgresUserRepository.ts
│   │   ├── migrations/
│   │   └── seeds/
│   ├── external-services/
│   │   ├── OpenAIService.ts
│   │   └── EmailService.ts
│   ├── cache/
│   │   └── RedisCache.ts
│   └── config/
│       └── database.config.ts
│
└── presentation/              # API/UI 레이어
    ├── http/
    │   ├── controllers/
    │   │   ├── TaskController.ts
    │   │   └── AuthController.ts
    │   ├── middleware/
    │   │   ├── AuthMiddleware.ts
    │   │   └── ErrorHandler.ts
    │   └── validators/
    │       └── CreateTaskValidator.ts
    ├── websocket/
    │   └── TaskEventGateway.ts
    └── graphql/               # 선택적
        └── resolvers/
```

### 3.2 기술 스택 선정

**백엔드 스택:**

```typescript
// 기술 선정 기준표
interface TechnologyDecision {
  technology: string;
  reason: string;
  alternatives: string[];
  tradeoffs: string;
}

const backendStack: TechnologyDecision[] = [
  {
    technology: 'NestJS (TypeScript)',
    reason: `
      - TypeScript 100% 지원
      - Clean Architecture 구현 용이
      - DI 컨테이너 내장
      - 풍부한 에코시스템 (Guards, Interceptors, Pipes)
      - 테스트 도구 내장
    `,
    alternatives: ['Express.js', 'Fastify', 'ASP.NET Core'],
    tradeoffs: '러닝 커브가 있지만 대규모 앱에 유리'
  },
  {
    technology: 'PostgreSQL',
    reason: `
      - ACID 보장 (금융 거래 필요 시)
      - 복잡한 쿼리 지원
      - JSON 컬럼 지원 (유연성)
      - 성숙한 생태계
    `,
    alternatives: ['MySQL', 'MongoDB', 'SQL Server'],
    tradeoffs: '초기 설정이 MongoDB보다 복잡'
  },
  {
    technology: 'TypeORM',
    reason: `
      - TypeScript 네이티브
      - 마이그레이션 자동화
      - Repository 패턴 지원
      - 트랜잭션 관리 용이
    `,
    alternatives: ['Prisma', 'Sequelize', 'Knex.js'],
    tradeoffs: 'N+1 쿼리 주의 필요'
  },
  {
    technology: 'Redis',
    reason: `
      - 세션 저장
      - API 응답 캐싱
      - 실시간 데이터 (WebSocket)
      - Rate Limiting
    `,
    alternatives: ['Memcached', 'In-memory cache'],
    tradeoffs: '추가 인프라 필요'
  },
  {
    technology: 'Jest',
    reason: `
      - TypeScript 지원
      - 스냅샷 테스트
      - Mocking 도구 강력
      - 병렬 실행
    `,
    alternatives: ['Vitest', 'Mocha + Chai'],
    tradeoffs: '없음 (표준)'
  }
];
```

**프론트엔드 스택:**

```typescript
const frontendStack: TechnologyDecision[] = [
  {
    technology: 'React + TypeScript',
    reason: `
      - 가장 큰 커뮤니티
      - 풍부한 라이브러리
      - TypeScript 완벽 지원
      - 성능 최적화 도구 다양
    `,
    alternatives: ['Vue.js', 'Svelte', 'Angular'],
    tradeoffs: '보일러플레이트가 많음'
  },
  {
    technology: 'TanStack Query (React Query)',
    reason: `
      - 서버 상태 관리 특화
      - 캐싱 자동화
      - Optimistic UI 쉬움
      - Devtools 제공
    `,
    alternatives: ['SWR', 'Redux + RTK Query'],
    tradeoffs: '러닝 커브'
  },
  {
    technology: 'Zustand',
    reason: `
      - 가벼움 (< 1KB)
      - 간단한 API
      - TypeScript 친화적
      - Redux Devtools 호환
    `,
    alternatives: ['Redux', 'Jotai', 'Recoil'],
    tradeoffs: '대규모 앱에서는 Redux가 나을 수도'
  },
  {
    technology: 'Tailwind CSS',
    reason: `
      - 빠른 개발
      - 일관성
      - 반응형 쉬움
      - 번들 크기 최적화
    `,
    alternatives: ['styled-components', 'CSS Modules', 'MUI'],
    tradeoffs: 'HTML이 복잡해질 수 있음'
  }
];
```

### 3.3 데이터베이스 스키마 설계

```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks 테이블
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'TODO',
  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  due_date TIMESTAMP,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 인덱스
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_parent_task_id (parent_task_id)
);

-- Task Tags (다대다 관계)
CREATE TABLE task_tags (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  PRIMARY KEY (task_id, tag),
  INDEX idx_tag (tag)
);

-- Task History (작업 변경 이력)
CREATE TABLE task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(50) NOT NULL,  -- CREATED, UPDATED, STATUS_CHANGED, etc.
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_task_id (task_id),
  INDEX idx_created_at (created_at)
);

-- AI Suggestions (AI 제안 이력)
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  suggestion_type VARCHAR(50) NOT NULL,  -- DECOMPOSE, ESTIMATE, etc.
  input_data JSONB NOT NULL,
  output_data JSONB NOT NULL,
  accepted BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_task_id (task_id),
  INDEX idx_accepted (accepted)
);
```

### 3.4 API 설계

**RESTful API 엔드포인트:**

```typescript
/**
 * API 설계 문서
 */

// ============================================
// 인증 API
// ============================================
POST   /api/auth/register      // 회원가입
POST   /api/auth/login          // 로그인
POST   /api/auth/refresh        // 토큰 갱신
POST   /api/auth/logout         // 로그아웃

// ============================================
// 작업 API
// ============================================
GET    /api/tasks                    // 작업 목록 조회
  ?status=TODO,IN_PROGRESS           // 상태 필터
  &priority=HIGH,CRITICAL            // 우선순위 필터
  &dueDate=2025-12-31                // 마감일 필터
  &page=1&limit=20                   // 페이지네이션

POST   /api/tasks                    // 작업 생성
GET    /api/tasks/:id                // 작업 상세 조회
PATCH  /api/tasks/:id                // 작업 수정
DELETE /api/tasks/:id                // 작업 삭제

POST   /api/tasks/:id/start          // 작업 시작
POST   /api/tasks/:id/complete       // 작업 완료
POST   /api/tasks/:id/block          // 작업 차단

// ============================================
// AI 기능 API
// ============================================
POST   /api/tasks/:id/decompose      // AI 작업 분해
  Body: { autoAccept?: boolean }

POST   /api/tasks/:id/estimate       // AI 시간 예측
  Response: { estimatedHours: number, confidence: number }

GET    /api/tasks/:id/suggestions    // AI 제안 이력 조회

POST   /api/tasks/:id/suggestions/:suggestionId/feedback
  Body: { accepted: boolean, feedback?: string }

// ============================================
// 대시보드 API
// ============================================
GET    /api/dashboard/summary        // 대시보드 요약
  Response: {
    totalTasks: number,
    completedToday: number,
    inProgress: number,
    overdue: number,
    upcomingDeadlines: Task[]
  }

GET    /api/dashboard/productivity   // 생산성 통계
  ?period=week|month|year

// ============================================
// WebSocket 이벤트
// ============================================
WS     /ws/tasks                     // 실시간 작업 동기화
  Events:
    - task.created
    - task.updated
    - task.deleted
    - task.status_changed
```

**API 응답 표준화:**

```typescript
// 성공 응답
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// 에러 응답
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// 예시
// GET /api/tasks?page=1&limit=10
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "API 구현",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "estimatedHours": 8,
      "dueDate": "2025-11-25T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45
  }
}
```

// 이미지로 교체되어야 함 : 시스템 아키텍처 다이어그램 - 클라이언트, API Gateway, 각종 서비스, 데이터베이스, 외부 API의 연결 구조를 보여주는 상세 다이어그램
프롬프트: A detailed system architecture diagram showing: top layer with Client SPA (React icon), middle layer with API Gateway and Auth Guard, service layer with 4 microservices (Auth, Task, AI, Collaboration), data layer with PostgreSQL and Redis databases, bottom layer with External APIs (OpenAI, email). All components connected with arrows showing data flow. Professional technical diagram style, blue and gray colors, white background.

## 4. GitHub Copilot 활용 전략 수립

프로젝트 기획이 완료되었다면, 이제 GitHub Copilot을 어떻게 활용할지 구체적인 전략을 세웁니다.

### 4.1 프로젝트 단계별 Copilot 활용 계획

**Phase 1: 프로젝트 초기화 (1일차)**

```markdown
## Copilot 활용 목표
- 프로젝트 구조 생성
- 기본 설정 파일 작성
- 공통 인터페이스 정의

## 프롬프트 전략
1. 명확한 기술 스택 명시
2. 프로젝트 구조 예시 제공
3. 네이밍 컨벤션 지정
```

```typescript
// .github/copilot-instructions.md
# 프로젝트 Copilot 설정

## 기술 스택
- Backend: NestJS + TypeScript + TypeORM + PostgreSQL
- Frontend: React + TypeScript + TanStack Query + Zustand
- Testing: Jest + Testing Library

## 코딩 컨벤션
- 함수명: camelCase
- 클래스명: PascalCase
- 파일명: kebab-case
- 인터페이스: I 접두사 (예: ITaskRepository)

## 아키텍처 원칙
- Clean Architecture 준수
- SOLID 원칙 적용
- DDD 패턴 사용
- 의존성 주입 활용

## 예시 프롬프트
"NestJS의 Clean Architecture를 따르는 CreateTaskUseCase를 작성해줘. 
DI로 ITaskRepository와 IAIService를 주입받고, 
ValidationException과 적절한 에러 처리를 포함해줘."
```

**Phase 2: 도메인 레이어 구현 (2-3일차)**

```typescript
// 프롬프트 예시 1: 엔티티 생성
/*
Task 엔티티를 작성해줘:
- id (UUID), title, description, status, priority
- estimatedHours, actualHours, dueDate
- parentTaskId, userId, assigneeId
- 생성일, 수정일
- 비즈니스 메서드: canBeCompleted(), isOverdue()
- 불변성 보장 (private set)
*/

// Copilot이 생성한 코드 (검증 필요!)
export class Task {
  private constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public priority: Priority,
    public estimatedHours: number,
    public actualHours: number | null,
    public dueDate: Date | null,
    public parentTaskId: string | null,
    public readonly userId: string,
    public assigneeId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  // 정적 팩토리 메서드
  static create(params: CreateTaskParams): Task {
    return new Task(
      generateId(),
      params.title,
      params.description || '',
      TaskStatus.TODO,
      params.priority || Priority.MEDIUM,
      params.estimatedHours || 0,
      null,
      params.dueDate || null,
      params.parentTaskId || null,
      params.userId,
      params.assigneeId || null,
      new Date(),
      new Date()
    );
  }

  canBeCompleted(): boolean {
    return this.status === TaskStatus.IN_PROGRESS;
  }

  isOverdue(): boolean {
    return this.dueDate !== null && 
           this.dueDate < new Date() && 
           this.status !== TaskStatus.DONE;
  }

  complete(): void {
    if (!this.canBeCompleted()) {
      throw new DomainException('작업을 완료할 수 없는 상태입니다');
    }
    this.status = TaskStatus.DONE;
    this.updatedAt = new Date();
  }
}
```

**Phase 3: 유스케이스 구현 (4-6일차)**

```typescript
// 프롬프트 예시 2: 유스케이스 생성
/*
CreateTaskUseCase를 작성해줘:
1. ITaskRepository와 IAIService를 DI로 주입
2. CreateTaskInput DTO 검증
3. Task 도메인 엔티티 생성
4. autoDecompose 옵션이 true면 AI 분해 실행
5. ValidationException, NotFoundException 처리
6. 트랜잭션 보장
*/

// Agent 모드 활용
// @workspace /new CreateTaskUseCase를 Clean Architecture로 구현해줘

// Copilot Agent가 생성:
// - CreateTaskUseCase.ts
// - CreateTaskInput.dto.ts
// - CreateTask.spec.ts (테스트)
// - 관련 인터페이스들

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly aiService: IAIService,
    private readonly eventBus: IEventBus
  ) {}

  async execute(input: CreateTaskInput): Promise<TaskResponseDto> {
    // 1. 입력 검증
    this.validateInput(input);

    // 2. 사용자 존재 확인 (선택적)
    // const user = await this.userRepository.findById(input.userId);
    // if (!user) throw new NotFoundException('User not found');

    // 3. 도메인 엔티티 생성
    const task = Task.create({
      title: input.title,
      description: input.description,
      priority: input.priority,
      estimatedHours: input.estimatedHours,
      dueDate: input.dueDate,
      userId: input.userId,
      assigneeId: input.assigneeId
    });

    // 4. AI 자동 분해 (선택적)
    let subTasks: Task[] = [];
    if (input.autoDecompose) {
      const suggestions = await this.aiService.decomposeTask({
        taskDescription: task.title,
        context: task.description
      });

      subTasks = suggestions.subTasks.map((suggestion, index) =>
        Task.create({
          title: suggestion,
          userId: input.userId,
          parentTaskId: task.id,
          estimatedHours: suggestions.estimatedHours[index],
          priority: task.priority
        })
      );
    }

    // 5. 저장 (트랜잭션)
    await this.taskRepository.transaction(async () => {
      await this.taskRepository.save(task);
      if (subTasks.length > 0) {
        await this.taskRepository.saveMany(subTasks);
      }
    });

    // 6. 이벤트 발행
    await this.eventBus.publish(new TaskCreatedEvent(task));

    // 7. DTO 변환 및 반환
    return TaskResponseDto.fromDomain(task);
  }

  private validateInput(input: CreateTaskInput): void {
    if (!input.title || input.title.trim().length < 3) {
      throw new ValidationException('제목은 3자 이상이어야 합니다');
    }

    if (input.estimatedHours && input.estimatedHours < 0) {
      throw new ValidationException('예상 시간은 0 이상이어야 합니다');
    }

    if (input.dueDate && input.dueDate < new Date()) {
      throw new ValidationException('마감일은 미래여야 합니다');
    }
  }
}
```

**Phase 4: 인프라 레이어 구현 (7-9일차)**

```typescript
// 프롬프트 예시 3: Repository 구현
/*
PostgresTaskRepository를 작성해줘:
- ITaskRepository 인터페이스 구현
- TypeORM 사용
- 트랜잭션 지원
- 복잡한 쿼리 최적화 (N+1 문제 방지)
- 에러 처리 (DatabaseException)
*/

// Slash 명령어 활용
// /tests PostgresTaskRepository의 통합 테스트 작성해줘

@Injectable()
export class PostgresTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>
  ) {}

  async save(task: Task): Promise<Task> {
    try {
      const entity = TaskMapper.toEntity(task);
      const saved = await this.taskRepo.save(entity);
      return TaskMapper.toDomain(saved);
    } catch (error) {
      throw new DatabaseException('Failed to save task', error);
    }
  }

  async findById(id: string): Promise<Task | null> {
    const entity = await this.taskRepo.findOne({
      where: { id },
      relations: ['subTasks', 'assignee'] // Eager loading
    });

    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const entities = await this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.subTasks', 'subTasks')
      .where('task.userId = :userId', { userId })
      .orderBy('task.priority', 'DESC')
      .addOrderBy('task.dueDate', 'ASC')
      .getMany();

    return entities.map(TaskMapper.toDomain);
  }

  async transaction<T>(work: () => Promise<T>): Promise<T> {
    return await this.taskRepo.manager.transaction(work);
  }
}
```

### 4.2 효과적인 프롬프트 작성 패턴

**패턴 1: 컨텍스트 제공형**

```markdown
# 좋은 예
"NestJS Clean Architecture 프로젝트에서 CreateTaskUseCase를 작성해줘.
도메인 레이어의 Task 엔티티는 이미 존재하고,
ITaskRepository와 IAIService 인터페이스를 DI로 주입받아야 해.
ValidationException과 NotFoundException을 사용하고,
Jest로 단위 테스트도 함께 작성해줘."

# 나쁜 예
"작업 생성 코드 만들어줘"
```

**패턴 2: 예시 기반형**

```typescript
// 이런 스타일로 UpdateTaskUseCase도 만들어줘
// (CreateTaskUseCase 코드를 컨텍스트로 제공)

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly aiService: IAIService
  ) {}

  async execute(input: CreateTaskInput): Promise<TaskResponseDto> {
    // 구현...
  }
}
```

**패턴 3: 제약 조건 명시형**

```markdown
"TaskController를 작성해줘:
- NestJS 데코레이터 사용 (@Controller, @Post, @Get 등)
- CreateTaskUseCase를 DI로 주입
- DTO 검증 (@Body, ValidationPipe)
- Swagger 문서화 (@ApiTags, @ApiOperation)
- JWT 인증 가드 적용 (@UseGuards(JwtAuthGuard))
- 에러를 HTTP 예외로 변환 (HttpExceptionFilter)"
```

### 4.3 코드 리뷰 및 개선 워크플로우

**Copilot이 생성한 코드 검증 체크리스트:**

```markdown
# AI 생성 코드 검토 체크리스트

## 기능 정확성
- [ ] 요구사항을 정확히 구현했는가?
- [ ] 엣지 케이스를 처리하는가?
- [ ] 에러 처리가 적절한가?

## 코드 품질
- [ ] SOLID 원칙을 따르는가?
- [ ] 네이밍이 명확한가?
- [ ] 주석이 필요한 복잡한 로직은 설명되었는가?

## 아키텍처 준수
- [ ] Clean Architecture 레이어를 준수하는가?
- [ ] 의존성 방향이 올바른가? (Domain ← Application ← Infrastructure)
- [ ] 인터페이스를 통한 추상화가 적절한가?

## 성능
- [ ] N+1 쿼리 문제가 없는가?
- [ ] 불필요한 반복문이 없는가?
- [ ] 캐싱이 필요한 부분은 고려되었는가?

## 보안
- [ ] 입력 검증이 충분한가?
- [ ] SQL Injection 취약점이 없는가?
- [ ] 인증/인가가 적절한가?

## 테스트 가능성
- [ ] 단위 테스트를 작성할 수 있는 구조인가?
- [ ] 의존성을 Mock할 수 있는가?
- [ ] 부작용(Side Effect)이 명확히 분리되었는가?
```

**개선 요청 프롬프트:**

```typescript
// Copilot에게 개선 요청
// /fix 이 코드의 N+1 쿼리 문제를 해결해줘

// /explain 이 코드가 왜 이렇게 작성되었는지 설명해줘

// /simplify 이 코드를 더 간결하게 리팩토링해줘

// /tests 이 함수의 단위 테스트를 작성해줘 (엣지 케이스 포함)
```

### 4.4 팀 협업 시나리오 (선택적)

**Git 워크플로우와 Copilot 통합:**

```markdown
# 브랜치 전략
- main: 프로덕션 배포
- develop: 개발 통합
- feature/*: 기능 개발
- hotfix/*: 긴급 수정

# Copilot 활용 팁
1. 기능 브랜치 생성 시 명확한 이름 사용
   - feature/task-decomposition-ai
   - feature/user-authentication
   
2. 커밋 메시지 자동 생성
   - Copilot에게: "이 변경사항에 대한 커밋 메시지 작성해줘 (Conventional Commits 형식)"
   
3. PR 설명 자동 생성
   - Copilot에게: "이 PR에 대한 설명을 작성해줘 (변경 내용, 테스트 방법, 스크린샷 포함)"
```

// 이미지로 교체되어야 함 : 개발 워크플로우 다이어그램 - 기획 → Copilot 프롬프트 → 코드 생성 → 리뷰 → 테스트 → 배포의 순환 구조
프롬프트: A circular development workflow diagram showing 6 stages in a clockwise flow: 1) Planning (blueprint icon), 2) Copilot Prompt (chat bubble with AI icon), 3) Code Generation (code brackets icon), 4) Review (magnifying glass icon), 5) Testing (checkmark list icon), 6) Deploy (rocket icon). Arrows connect each stage. Center shows "Iterative Process" text. Modern gradient colors (blue to purple), white background, professional software development style.

## 실습 결과 요약

12주차에서는 최종 프로젝트의 기획과 설계를 완료했습니다. 단순히 코드를 작성하는 것이 아니라, 문제를 정의하고 시스템을 설계하는 소프트웨어 엔지니어로서의 역량을 발휘한 시간이었습니다.

### 핵심 학습 내용

**1. 실전 문제 발견 및 정의**
- 5W1H 프레임워크로 문제를 명확히 정의
- 사용자 페르소나 작성으로 실제 사용자 이해
- 비즈니스 가치와 학습 가치를 모두 고려한 주제 선정
- 기능 요구사항과 비기능 요구사항의 구체화
- MVP 범위 설정 (Must/Should/Nice to Have)

**2. 컴퓨팅 사고의 통합 적용**
- **분해**: Top-Down 접근으로 시스템을 모듈로 나누기
  - 도메인 주도 설계(DDD) 적용
  - Aggregate Root와 엔티티 구분
  - 3단계 계층 구조 설계
- **패턴 인식**: 재사용 가능한 패턴 발굴
  - CRUD, 상태 기계, 옵저버, Repository 패턴
  - AI 서비스 공통 인터페이스 설계
- **추상화**: Clean Architecture 레이어 구조
  - Domain → Application → Infrastructure → Presentation
  - 의존성 역전 원칙 적용
  - 인터페이스를 통한 결합도 감소
- **알고리즘**: 효율적인 비즈니스 로직
  - 작업 우선순위 계산 알고리즘
  - 작업 일정 자동 배치 (위상 정렬)
  - O(n log n) 시간 복잡도 고려

**3. 실전 아키텍처 설계**
- Clean Architecture 기반 모듈 구조 설계
- 기술 스택 선정과 트레이드오프 분석
  - Backend: NestJS + TypeScript + PostgreSQL + Redis
  - Frontend: React + TypeScript + TanStack Query + Zustand
  - Testing: Jest + Testing Library
- 데이터베이스 스키마 설계 (인덱스 최적화 포함)
- RESTful API 설계 및 표준화된 응답 포맷
- WebSocket 실시간 통신 설계

**4. GitHub Copilot 활용 전략**
- 프로젝트 단계별 Copilot 활용 계획 수립
  - Phase 1: 프로젝트 초기화 (1일)
  - Phase 2: 도메인 레이어 (2-3일)
  - Phase 3: 유스케이스 (4-6일)
  - Phase 4: 인프라 레이어 (7-9일)
- 효과적인 프롬프트 작성 패턴
  - 컨텍스트 제공형
  - 예시 기반형
  - 제약 조건 명시형
- 코드 리뷰 및 검증 체크리스트
- Agent 모드와 Slash 명령어 활용 전략

### 프로젝트 준비 완료 체크리스트

12주차를 완료하면서 다음 항목들을 체크할 수 있어야 합니다:

**기획 완료**
- [ ] 명확한 문제 정의 (5W1H 완성)
- [ ] 사용자 페르소나 작성
- [ ] 기능 요구사항 명세 (Must/Should/Nice)
- [ ] 비기능 요구사항 정의
- [ ] MVP 범위 확정

**설계 완료**
- [ ] 시스템 아키텍처 다이어그램 작성
- [ ] Clean Architecture 레이어 구조 설계
- [ ] 도메인 모델 정의 (엔티티, VO, Aggregate)
- [ ] 데이터베이스 스키마 설계
- [ ] API 엔드포인트 설계

**기술 스택 결정**
- [ ] Backend 기술 스택 선정 및 정당화
- [ ] Frontend 기술 스택 선정 및 정당화
- [ ] 인프라 및 배포 전략 수립
- [ ] 테스트 전략 수립

**Copilot 활용 준비**
- [ ] .github/copilot-instructions.md 작성
- [ ] 프로젝트 단계별 프롬프트 전략 수립
- [ ] 코드 리뷰 체크리스트 준비
- [ ] 테스트 자동화 계획

### 실습 과제

다음 주 구현을 위해 준비해야 할 사항:

1. **개발 환경 설정**
   - Node.js, PostgreSQL, Redis 설치
   - IDE 및 GitHub Copilot 설정
   - Git 저장소 생성

2. **프로젝트 초기화**
   - NestJS 프로젝트 생성
   - React 프로젝트 생성
   - 디렉토리 구조 설정

3. **기본 설정 파일 작성**
   - package.json, tsconfig.json
   - .env.example
   - .eslintrc, .prettierrc
   - docker-compose.yml (선택)

4. **첫 번째 기능 구현 계획**
   - 사용자 인증부터 시작 (가장 기초)
   - 작업 CRUD 구현
   - AI 분해 기능 통합

### 전문가로의 전환

이번 주차를 통해 여러분은 중요한 전환점을 넘었습니다:

**Before (코더):**
- "무엇을 만들어야 할까?" → 주어진 기능 구현
- "어떻게 작성할까?" → 코드 작성에 집중
- "일단 만들고 보자" → 즉흥적 개발

**After (엔지니어):**
- "왜 만들어야 하는가?" → 문제 본질 파악
- "어떻게 설계할까?" → 아키텍처부터 고민
- "확장 가능한가?" → 장기적 관점

13주차부터는 이 설계를 바탕으로 GitHub Copilot과 함께 실제 구현에 돌입합니다. 명확한 설계가 있기에 Copilot은 여러분의 의도를 정확히 이해하고 고품질 코드를 생성할 것입니다.

### 다음 주 예고: 최종 프로젝트 II - 구현

13주차에서는 드디어 구현을 시작합니다:
- GitHub Copilot과 협업하여 프로젝트 구현
- 도메인 레이어부터 순차적으로 구축
- 복잡한 기능 구현과 프롬프트 최적화
- 테스트 자동화 및 CI/CD 구축
- 반복적 개선 및 리팩토링

설계가 탄탄하기에 구현은 빠르고 정확할 것입니다. 컴퓨팅 사고와 바이브 코딩의 진가가 발휘되는 순간입니다. 준비되셨나요?
