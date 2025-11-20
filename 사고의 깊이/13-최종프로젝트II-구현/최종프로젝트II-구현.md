# Chapter 13. 최종 프로젝트 II - 구현

**난이도: 🔴 고급**

## 개요

설계가 완료되었으니 이제 실제 구현에 돌입합니다. 이번 챕터는 GitHub Copilot과 함께 이전 챕터에서 설계한 시스템을 코드로 구현하는 시간입니다. 명확한 설계가 있기에 Copilot은 여러분의 의도를 정확히 이해하고, 고품질 코드를 빠르게 생성할 것입니다.

바이브 코딩의 진가가 발휘되는 순간입니다. 여러분은 "무엇을" 만들지에 집중하고, Copilot은 "어떻게" 만들지를 제안합니다. 하지만 Copilot이 생성한 코드를 맹목적으로 수용하지 않습니다. 검증하고, 개선하고, 테스트하는 과정이 반드시 필요합니다.

### 학습 목표

**1. 체계적인 구현 프로세스**
- Domain → Application → Infrastructure → Presentation 순서
- 단계별 검증과 테스트
- Git 브랜치 전략과 커밋 관리
- 반복적 개선 워크플로우

**2. 고급 프롬프트 엔지니어링**
- 복잡한 기능을 명확히 전달하는 프롬프트
- 컨텍스트 제공을 통한 정확도 향상
- Agent 모드의 효과적 활용
- 다중 파일 편집 전략

**3. 코드 품질 관리**
- AI 생성 코드의 리뷰 기법
- SOLID 원칙 준수 검증
- 성능 및 보안 체크
- 리팩토링 전략

**4. 테스트 주도 개발 (TDD)**
- Copilot과 함께하는 테스트 작성
- 단위 테스트, 통합 테스트, E2E 테스트
- 테스트 커버리지 관리
- CI/CD 파이프라인 구축

**5. 실전 문제 해결**
- 디버깅과 에러 해결
- 성능 최적화
- 예상치 못한 요구사항 대응
- 기술 부채 관리

이번 주차를 마치면 복잡한 프로젝트를 AI와 협업하여 효율적으로 구현하는 능력을 갖추게 됩니다.

## 1. GitHub Copilot과 협업하여 프로젝트 구현

Clean Architecture를 따라 안쪽 레이어부터 바깥쪽으로 구현합니다. 각 단계마다 Copilot을 효과적으로 활용하는 전략을 살펴봅니다.

### 1.1 Domain 레이어 구현 (1-2일차)

**Step 1: 엔티티 구현**

```typescript
// 프롬프트 전략: 명확한 요구사항 + 제약 조건
/*
Task 엔티티를 Domain-Driven Design 원칙으로 작성해줘:

요구사항:
- 불변성 보장 (private constructor, factory method)
- 비즈니스 로직 메서드 (start, complete, decompose)
- 상태 전이 검증
- 도메인 이벤트 발행

제약 조건:
- 외부 의존성 없음 (순수 TypeScript)
- Value Object 사용 (Priority, TaskStatus)
- 엔티티 유효성 검증
*/

// Copilot이 생성한 코드 (일부)
export class Task {
  private constructor(
    private readonly _id: TaskId,
    private _title: TaskTitle,
    private _description: string,
    private _status: TaskStatus,
    private _priority: Priority,
    // ... 기타 속성
  ) {}

  // Factory Method
  static create(props: CreateTaskProps): Result<Task> {
    // 유효성 검증
    if (props.title.length < 3) {
      return Result.fail('Title must be at least 3 characters');
    }

    const task = new Task(
      TaskId.create(),
      TaskTitle.create(props.title),
      props.description || '',
      TaskStatus.TODO,
      props.priority || Priority.MEDIUM,
      // ...
    );

    // 도메인 이벤트
    task.addDomainEvent(new TaskCreatedEvent(task));

    return Result.ok(task);
  }

  // 비즈니스 로직
  start(): Result<void> {
    if (this._status !== TaskStatus.TODO) {
      return Result.fail(`Cannot start task in ${this._status} status`);
    }

    this._status = TaskStatus.IN_PROGRESS;
    this.addDomainEvent(new TaskStartedEvent(this));

    return Result.ok();
  }

  complete(): Result<void> {
    if (this._status !== TaskStatus.IN_PROGRESS) {
      return Result.fail(`Cannot complete task in ${this._status} status`);
    }

    // 하위 작업 완료 체크
    if (this.hasIncompleteSubTasks()) {
      return Result.fail('All subtasks must be completed first');
    }

    this._status = TaskStatus.DONE;
    this._completedAt = new Date();
    this.addDomainEvent(new TaskCompletedEvent(this));

    return Result.ok();
  }

  // Getter methods
  get id(): TaskId { return this._id; }
  get title(): string { return this._title.value; }
  get status(): TaskStatus { return this._status; }
  // ...
}
```

**검증 포인트:**
- [ ] 불변성이 보장되는가? (private setter, readonly)
- [ ] 비즈니스 규칙이 엔티티 내부에 있는가?
- [ ] 외부 의존성이 없는가?
- [ ] 도메인 이벤트가 적절히 발생하는가?

### 1.2 Application 레이어 구현 (3-4일차)

**Step 2: Use Case 구현**

```typescript
// 프롬프트: Agent 모드 활용
// @workspace /new CreateTaskUseCase를 구현해줘. 
// ITaskRepository와 IAIService를 주입받고, 
// 트랜잭션과 에러 처리를 포함해줘.

@Injectable()
export class CreateTaskUseCase implements IUseCase<CreateTaskInput, TaskDto> {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly aiService: IAIService,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  async execute(input: CreateTaskInput): Promise<Result<TaskDto>> {
    try {
      // 1. 입력 검증
      const validationResult = this.validate(input);
      if (validationResult.isFailure) {
        return Result.fail(validationResult.error);
      }

      // 2. 도메인 엔티티 생성
      const taskOrError = Task.create({
        title: input.title,
        description: input.description,
        priority: input.priority,
        userId: input.userId,
        dueDate: input.dueDate
      });

      if (taskOrError.isFailure) {
        return Result.fail(taskOrError.error);
      }

      const task = taskOrError.getValue();

      // 3. AI 자동 분해 (선택적)
      let subTasks: Task[] = [];
      if (input.autoDecompose) {
        const decompositionResult = await this.aiService.decomposeTask({
          taskDescription: task.title,
          context: task.description
        });

        if (decompositionResult.isSuccess) {
          const suggestions = decompositionResult.getValue();
          subTasks = this.createSubTasks(task, suggestions);
        }
      }

      // 4. 트랜잭션으로 저장
      await this.unitOfWork.transaction(async () => {
        await this.taskRepository.save(task);

        if (subTasks.length > 0) {
          await this.taskRepository.saveMany(subTasks);
        }

        // 도메인 이벤트 발행
        await this.eventBus.publishAll(task.domainEvents);
      });

      // 5. DTO 변환
      const dto = TaskMapper.toDto(task);
      return Result.ok(dto);

    } catch (error) {
      return Result.fail(`Failed to create task: ${error.message}`);
    }
  }

  private validate(input: CreateTaskInput): Result<void> {
    if (!input.title || input.title.trim().length < 3) {
      return Result.fail('Title must be at least 3 characters');
    }

    if (input.dueDate && input.dueDate < new Date()) {
      return Result.fail('Due date must be in the future');
    }

    return Result.ok();
  }

  private createSubTasks(parent: Task, suggestions: AIDecompositionResult): Task[] {
    return suggestions.subTasks.map((suggestion, index) => {
      const subTaskOrError = Task.create({
        title: suggestion,
        userId: parent.userId,
        parentId: parent.id,
        priority: parent.priority,
        estimatedHours: suggestions.estimatedHours[index]
      });

      return subTaskOrError.getValue();
    });
  }
}
```

**Copilot 활용 팁:**
- Use Case는 패턴이 반복되므로 첫 번째를 완성하면 나머지는 빠르게 생성 가능
- `// 이 패턴으로 UpdateTaskUseCase도 만들어줘` 라는 프롬프트로 재활용

### 1.3 Infrastructure 레이어 구현 (5-7일차)

**Step 3: Repository 구현**

```typescript
// 프롬프트: 구체적인 기술 스택 명시
/*
PostgresTaskRepository를 TypeORM으로 구현해줘:
- ITaskRepository 인터페이스 구현
- N+1 문제 방지 (eager loading, join)
- 트랜잭션 지원
- 에러를 DatabaseException으로 변환
- 복잡한 쿼리는 QueryBuilder 사용
*/

@Injectable()
export class PostgresTaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>,
    private readonly mapper: TaskMapper
  ) {}

  async save(task: Task): Promise<void> {
    try {
      const entity = this.mapper.toPersistence(task);
      await this.repo.save(entity);
    } catch (error) {
      throw new DatabaseException('Failed to save task', error);
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const entity = await this.repo.findOne({
        where: { id },
        relations: ['subTasks', 'assignee'] // Eager loading으로 N+1 방지
      });

      return entity ? this.mapper.toDomain(entity) : null;
    } catch (error) {
      throw new DatabaseException('Failed to find task', error);
    }
  }

  async findByUserId(userId: string, filter?: TaskFilter): Promise<Task[]> {
    try {
      const qb = this.repo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.subTasks', 'subTasks')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .where('task.userId = :userId', { userId });

      // 동적 필터링
      if (filter?.status) {
        qb.andWhere('task.status IN (:...statuses)', { statuses: filter.status });
      }

      if (filter?.priority) {
        qb.andWhere('task.priority IN (:...priorities)', { priorities: filter.priority });
      }

      if (filter?.dueDate) {
        qb.andWhere('task.dueDate <= :dueDate', { dueDate: filter.dueDate });
      }

      // 정렬
      qb.orderBy('task.priority', 'DESC')
        .addOrderBy('task.dueDate', 'ASC', 'NULLS LAST');

      // 페이지네이션
      if (filter?.page && filter?.limit) {
        qb.skip((filter.page - 1) * filter.limit).take(filter.limit);
      }

      const entities = await qb.getMany();
      return entities.map(e => this.mapper.toDomain(e));
    } catch (error) {
      throw new DatabaseException('Failed to find tasks', error);
    }
  }

  async findOverdue(): Promise<Task[]> {
    const entities = await this.repo
      .createQueryBuilder('task')
      .where('task.dueDate < :now', { now: new Date() })
      .andWhere('task.status != :done', { done: TaskStatus.DONE })
      .getMany();

    return entities.map(e => this.mapper.toDomain(e));
  }
}
```

**성능 최적화 체크:**
- [ ] N+1 쿼리가 발생하지 않는가?
- [ ] 인덱스가 적절히 사용되는가?
- [ ] 불필요한 데이터 로딩은 없는가?
- [ ] 페이지네이션이 구현되었는가?

### 1.4 Presentation 레이어 구현 (8-9일차)

**Step 4: Controller 구현**

```typescript
// Slash 명령어 활용: /doc로 Swagger 문서 자동 생성
@ApiTags('Tasks')
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createTask(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: UserPayload
  ): Promise<ApiResponse<TaskResponseDto>> {
    const result = await this.createTaskUseCase.execute({
      ...dto,
      userId: user.id
    });

    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }

    return {
      success: true,
      data: result.getValue()
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get user tasks' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getTasks(
    @CurrentUser() user: UserPayload,
    @Query() query: GetTasksQueryDto
  ): Promise<ApiResponse<TaskResponseDto[]>> {
    const result = await this.getTasksUseCase.execute({
      userId: user.id,
      filter: query
    });

    return {
      success: true,
      data: result.getValue(),
      meta: {
        page: query.page || 1,
        limit: query.limit || 20,
        total: result.getValue().length
      }
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: UserPayload
  ): Promise<ApiResponse<TaskResponseDto>> {
    const result = await this.updateTaskUseCase.execute({
      id,
      userId: user.id,
      ...dto
    });

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return {
      success: true,
      data: result.getValue()
    };
  }
}
```

// 이미지로 교체되어야 함 : Clean Architecture 레이어별 구현 순서 - Domain → Application → Infrastructure → Presentation의 흐름을 화살표로 표시한 다이어그램
프롬프트: A layered architecture implementation flow diagram showing 4 horizontal layers stacked from bottom to top: 1) Domain Layer (core icon, pure business logic), 2) Application Layer (use case icon, business rules), 3) Infrastructure Layer (database/API icons, external dependencies), 4) Presentation Layer (controller/UI icons). Large upward arrows on the left showing "Implementation Order" from bottom to top. Each layer has checkmark icons. Blue gradient colors, professional software architecture style, white background.

## 2. 복잡한 기능 구현과 프롬프트 최적화

AI 기반 작업 분해 기능처럼 복잡한 로직은 프롬프트를 어떻게 작성하느냐가 결과의 품질을 결정합니다.

### 2.1 AI 서비스 통합

**고급 프롬프트 기법:**

```typescript
// 프롬프트: 멀티턴 대화로 점진적 개선
// 1차: 기본 구조 생성
// "OpenAI API를 사용하는 TaskDecompositionService를 만들어줘"

// 2차: 프롬프트 엔지니어링 추가
// "작업 분해 프롬프트를 개선해줘. 컴퓨팅 사고 원칙(분해, 패턴, 추상화)을 적용하도록"

// 3차: 에러 처리 강화
// "API 실패, 타임아웃, 부적절한 응답을 처리하는 로직 추가해줘"

@Injectable()
export class TaskDecompositionService implements IAIService {
  constructor(
    private readonly openai: OpenAIApi,
    private readonly config: ConfigService
  ) {}

  async decomposeTask(input: DecomposeTaskInput): Promise<Result<AIDecompositionResult>> {
    try {
      // 체계적인 프롬프트 구성
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(input);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content);

      // 결과 검증
      if (!this.validateResponse(result)) {
        return Result.fail('Invalid AI response format');
      }

      return Result.ok({
        subTasks: result.subTasks,
        estimatedHours: result.estimatedHours,
        reasoning: result.reasoning,
        confidence: result.confidence
      });

    } catch (error) {
      if (error.code === 'rate_limit_exceeded') {
        return Result.fail('AI service rate limit exceeded. Please try again later.');
      }
      return Result.fail(`AI service error: ${error.message}`);
    }
  }

  private buildSystemPrompt(): string {
    return `
당신은 소프트웨어 개발 작업을 구현 가능한 단위로 분해하는 전문가입니다.

컴퓨팅 사고 원칙을 적용하세요:
1. 분해 (Decomposition): 큰 작업을 4-8시간 내 완료 가능한 작은 작업으로
2. 패턴 인식 (Pattern Recognition): 유사한 작업 패턴 활용
3. 추상화 (Abstraction): 구체적이지만 구현 방법은 열어두기
4. 알고리즘적 사고: 의존성과 순서 고려

응답 형식 (JSON):
{
  "subTasks": ["작업1", "작업2", ...],
  "estimatedHours": [4, 6, ...],
  "reasoning": "분해 근거",
  "confidence": 0.85
}
    `.trim();
  }

  private buildUserPrompt(input: DecomposeTaskInput): string {
    return `
다음 작업을 분해해주세요:

작업 제목: ${input.taskDescription}
${input.context ? `컨텍스트: ${input.context}` : ''}
${input.technicalStack ? `기술 스택: ${input.technicalStack.join(', ')}` : ''}
${input.constraints ? `제약 조건: ${input.constraints}` : ''}

각 하위 작업은:
- 독립적으로 테스트 가능해야 합니다
- 명확한 완료 기준이 있어야 합니다
- 의존성이 있다면 순서를 고려해주세요
    `.trim();
  }

  private validateResponse(response: any): boolean {
    return (
      Array.isArray(response.subTasks) &&
      Array.isArray(response.estimatedHours) &&
      response.subTasks.length === response.estimatedHours.length &&
      typeof response.reasoning === 'string' &&
      typeof response.confidence === 'number'
    );
  }
}
```

### 2.2 실시간 협업 기능 (WebSocket)

```typescript
// Agent 모드: 복잡한 WebSocket Gateway 생성
// @workspace /new TaskEventGateway를 만들어줘. 
// 실시간 작업 동기화, 사용자 인증, 룸 관리를 포함해줘.

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'tasks'
})
export class TaskEventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userRooms = new Map<string, Set<string>>(); // userId -> Set of roomIds

  constructor(
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      // 인증
      const token = client.handshake.auth.token;
      const payload = await this.jwtService.verifyAsync(token);

      client.data.userId = payload.sub;
      client.data.user = payload;

      // 사용자 방에 참가
      const userRoom = `user:${payload.sub}`;
      client.join(userRoom);

      this.userRooms.set(payload.sub, new Set([userRoom]));

      console.log(`User ${payload.sub} connected`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userRooms.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('joinProject')
  handleJoinProject(
    @MessageBody() data: { projectId: string },
    @ConnectedSocket() client: Socket
  ) {
    const projectRoom = `project:${data.projectId}`;
    client.join(projectRoom);

    const userId = client.data.userId;
    const rooms = this.userRooms.get(userId) || new Set();
    rooms.add(projectRoom);
    this.userRooms.set(userId, rooms);

    return { success: true, room: projectRoom };
  }

  // 작업 생성 이벤트 브로드캐스트
  notifyTaskCreated(task: Task) {
    const userRoom = `user:${task.userId}`;
    this.server.to(userRoom).emit('task.created', {
      task: TaskMapper.toDto(task),
      timestamp: new Date()
    });
  }

  // 작업 업데이트 이벤트
  notifyTaskUpdated(task: Task) {
    const userRoom = `user:${task.userId}`;
    this.server.to(userRoom).emit('task.updated', {
      task: TaskMapper.toDto(task),
      timestamp: new Date()
    });
  }
}
```

## 3. 코드 품질 관리 및 리뷰

AI가 생성한 코드도 반드시 리뷰가 필요합니다. 체계적인 리뷰 프로세스를 수립합니다.

### 3.1 코드 리뷰 체크리스트

```markdown
# PR 리뷰 체크리스트

## Architecture
- [ ] Clean Architecture 레이어를 준수하는가?
- [ ] 의존성 방향이 올바른가? (→ Domain)
- [ ] 도메인 로직이 Domain 레이어에 있는가?

## SOLID 원칙
- [ ] SRP: 하나의 책임만 가지는가?
- [ ] OCP: 확장에 열려있고 수정에 닫혀있는가?
- [ ] LSP: 하위 타입이 상위 타입을 대체 가능한가?
- [ ] ISP: 인터페이스가 작고 구체적인가?
- [ ] DIP: 구체 클래스가 아닌 인터페이스에 의존하는가?

## 성능
- [ ] N+1 쿼리 문제가 없는가?
- [ ] 불필요한 반복문이 없는가?
- [ ] 캐싱이 적절히 적용되었는가?

## 보안
- [ ] 입력 검증이 충분한가?
- [ ] SQL Injection 취약점이 없는가?
- [ ] 인증/인가가 적절한가?
- [ ] 민감 정보가 로그에 노출되지 않는가?

## 테스트
- [ ] 단위 테스트가 작성되었는가?
- [ ] 테스트 커버리지가 80% 이상인가?
- [ ] 엣지 케이스가 테스트되었는가?

## 코드 품질
- [ ] 변수/함수명이 명확한가?
- [ ] 매직 넘버가 없는가?
- [ ] 주석이 필요한 복잡한 로직은 설명되었는가?
- [ ] 중복 코드가 없는가?
```

### 3.2 자동화된 코드 품질 검증

```json
// package.json - 품질 검증 스크립트
{
  "scripts": {
    "lint": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "quality": "npm run lint && npm run type-check && npm run test",
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests"
    ]
  }
}
```

```yaml
# .github/workflows/quality-check.yml
name: Code Quality Check

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm run test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 4. 테스트 전략 및 자동화

Copilot을 활용하여 테스트 코드를 효율적으로 작성합니다.

### 4.1 단위 테스트

```typescript
// Slash 명령어: /tests CreateTaskUseCase의 테스트 작성해줘

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;
  let mockAIService: jest.Mocked<IAIService>;
  let mockUnitOfWork: jest.Mocked<IUnitOfWork>;
  let mockEventBus: jest.Mocked<IEventBus>;

  beforeEach(() => {
    mockTaskRepository = {
      save: jest.fn(),
      saveMany: jest.fn(),
      findById: jest.fn()
    } as any;

    mockAIService = {
      decomposeTask: jest.fn()
    } as any;

    mockUnitOfWork = {
      transaction: jest.fn((work) => work())
    } as any;

    mockEventBus = {
      publishAll: jest.fn()
    } as any;

    useCase = new CreateTaskUseCase(
      mockTaskRepository,
      mockAIService,
      mockUnitOfWork,
      mockEventBus
    );
  });

  describe('execute', () => {
    it('should_create_task_successfully', async () => {
      // Arrange
      const input: CreateTaskInput = {
        title: 'Implement authentication',
        description: 'JWT-based auth',
        priority: Priority.HIGH,
        userId: 'user-123',
        autoDecompose: false
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockTaskRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUnitOfWork.transaction).toHaveBeenCalledTimes(1);
    });

    it('should_fail_with_invalid_title', async () => {
      // Arrange
      const input: CreateTaskInput = {
        title: 'ab', // 너무 짧음
        userId: 'user-123'
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('at least 3 characters');
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should_decompose_task_when_autoDecompose_is_true', async () => {
      // Arrange
      const input: CreateTaskInput = {
        title: 'Build REST API',
        userId: 'user-123',
        autoDecompose: true
      };

      mockAIService.decomposeTask.mockResolvedValue(
        Result.ok({
          subTasks: ['Design endpoints', 'Implement controllers', 'Write tests'],
          estimatedHours: [2, 4, 2],
          reasoning: 'Standard API development',
          confidence: 0.9
        })
      );

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockAIService.decomposeTask).toHaveBeenCalledTimes(1);
      expect(mockTaskRepository.saveMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: expect.any(String) })
        ])
      );
    });

    it('should_rollback_on_repository_error', async () => {
      // Arrange
      const input: CreateTaskInput = {
        title: 'Test task',
        userId: 'user-123'
      };

      mockTaskRepository.save.mockRejectedValue(new Error('DB error'));

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Failed to create task');
    });
  });
});
```

### 4.2 통합 테스트

```typescript
// E2E 테스트: API 엔드포인트 전체 플로우
describe('Task API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 테스트 사용자 로그인
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/tasks', () => {
    it('should_create_task_and_return_201', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Write documentation',
          description: 'API documentation',
          priority: 'HIGH'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Write documentation');
    });

    it('should_return_400_for_invalid_input', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'ab' // 너무 짧음
        })
        .expect(400);
    });

    it('should_return_401_without_auth_token', async () => {
      await request(app.getHttpServer())
        .post('/api/tasks')
        .send({
          title: 'Unauthorized task'
        })
        .expect(401);
    });
  });
});
```

## 5. 반복적 개선 및 피드백

구현은 한 번에 완성되지 않습니다. 지속적인 개선이 필요합니다.

### 5.1 성능 프로파일링 및 최적화

```typescript
// 프롬프트: "이 쿼리의 성능을 개선해줘"
// Before: N+1 쿼리 문제
async findTasksWithSubTasks(userId: string): Promise<Task[]> {
  const tasks = await this.repo.find({ where: { userId } });

  for (const task of tasks) {
    // N+1 문제!
    task.subTasks = await this.repo.find({ where: { parentId: task.id } });
  }

  return tasks;
}

// After: 단일 쿼리로 최적화
async findTasksWithSubTasks(userId: string): Promise<Task[]> {
  const tasks = await this.repo
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.subTasks', 'subTasks')
    .where('task.userId = :userId', { userId })
    .orderBy('task.createdAt', 'DESC')
    .addOrderBy('subTasks.order', 'ASC')
    .getMany();

  return tasks.map(e => this.mapper.toDomain(e));
}
```

### 5.2 리팩토링

```typescript
// Copilot을 활용한 리팩토링
// /simplify 이 함수를 더 간결하게 리팩토링해줘

// Before: 중복 코드와 복잡한 조건
if (task.status === TaskStatus.TODO) {
  task.status = TaskStatus.IN_PROGRESS;
  task.startedAt = new Date();
  await this.repository.save(task);
  await this.eventBus.publish(new TaskStartedEvent(task));
} else if (task.status === TaskStatus.IN_PROGRESS) {
  if (task.subTasks.every(s => s.status === TaskStatus.DONE)) {
    task.status = TaskStatus.DONE;
    task.completedAt = new Date();
    await this.repository.save(task);
    await this.eventBus.publish(new TaskCompletedEvent(task));
  } else {
    throw new Error('Cannot complete task with incomplete subtasks');
  }
}

// After: 전략 패턴 + 도메인 로직 분리
class TaskStateMachine {
  private transitions: Map<TaskStatus, TransitionStrategy>;

  constructor(private eventBus: IEventBus) {
    this.transitions = new Map([
      [TaskStatus.TODO, new StartTaskStrategy(eventBus)],
      [TaskStatus.IN_PROGRESS, new CompleteTaskStrategy(eventBus)]
    ]);
  }

  async transition(task: Task, to: TaskStatus): Promise<Result<Task>> {
    const strategy = this.transitions.get(task.status);
    if (!strategy) {
      return Result.fail(`No transition available from ${task.status}`);
    }

    return await strategy.execute(task, to);
  }
}
```

### 5.3 기술 부채 관리

```markdown
# 기술 부채 트래킹 (technical-debt.md)

## High Priority
- [ ] TaskRepository에 캐싱 레이어 추가 (성능 개선 30% 예상)
- [ ] AI 서비스 재시도 로직 구현 (안정성)
- [ ] WebSocket 연결 풀 관리 (확장성)

## Medium Priority
- [ ] 에러 메시지 다국어 지원
- [ ] 로깅 구조화 및 집계
- [ ] API 응답 시간 모니터링 대시보드

## Low Priority
- [ ] 코드 주석 보완
- [ ] 타입 정의 개선
- [ ] 테스트 커버리지 90% 달성
```

// 이미지로 교체되어야 함 : 반복적 개선 사이클 - 구현 → 테스트 → 리뷰 → 리팩토링 → 배포의 순환 구조를 보여주는 다이어그램
프롬프트: A circular iterative improvement cycle diagram showing 5 stages connected by curved arrows in clockwise direction: 1) Implementation (coding icon), 2) Testing (test tube with checkmark), 3) Review (magnifying glass), 4) Refactoring (refresh/optimization icon), 5) Deploy (rocket launch). Center shows "Continuous Improvement" text. Each stage has small progress indicators. Green and blue gradient colors, agile development style, white background.

## 실습 결과 요약

13주차에서 우리는 설계를 코드로 구현하는 전 과정을 경험했습니다. GitHub Copilot과 함께 복잡한 시스템을 빠르고 정확하게 구현하는 방법을 배웠습니다.

### 핵심 학습 내용

**1. 체계적인 구현 프로세스**
- Clean Architecture 레이어별 구현 순서
  - Domain: 순수 비즈니스 로직, 외부 의존성 없음
  - Application: Use Case와 비즈니스 규칙
  - Infrastructure: 구체적 기술 구현 (DB, API)
  - Presentation: Controller와 API 엔드포인트
- 각 단계마다 테스트와 검증 수행
- Git 브랜치 전략과 체계적 커밋

**2. 고급 프롬프트 엔지니어링**
- 명확한 요구사항 + 제약 조건 제시
- 멀티턴 대화로 점진적 개선
- Agent 모드 활용 (`@workspace /new`)
- Slash 명령어 활용 (`/tests`, `/fix`, `/simplify`, `/doc`)
- 컨텍스트 제공을 통한 정확도 향상
- 예시 기반 프롬프트로 패턴 재활용

**3. 복잡한 기능 구현**
- AI 서비스 통합 (OpenAI API)
  - 체계적인 시스템 프롬프트 구성
  - 응답 검증 및 에러 처리
  - Rate limit 및 타임아웃 관리
- 실시간 협업 (WebSocket)
  - 인증 및 룸 관리
  - 이벤트 브로드캐스트
  - 연결 관리 및 모니터링

**4. 코드 품질 관리**
- AI 생성 코드 리뷰 체크리스트
  - Architecture: Clean Architecture 준수
  - SOLID 원칙 검증
  - 성능: N+1 쿼리, 캐싱
  - 보안: 입력 검증, SQL Injection 방지
  - 테스트: 커버리지 80% 이상
- 자동화된 품질 검증
  - ESLint, Prettier, TypeScript
  - Pre-commit hooks (lint-staged)
  - CI/CD 파이프라인 (GitHub Actions)
  - 코드 커버리지 리포트

**5. 테스트 전략**
- 단위 테스트: Use Case, Service, Repository 테스트
  - Mocking을 통한 의존성 격리
  - 엣지 케이스 커버
  - AAA 패턴 (Arrange-Act-Assert)
- 통합 테스트: API E2E 테스트
  - 실제 환경에서 전체 플로우 검증
  - 인증/인가 테스트
  - 에러 시나리오 테스트
- Copilot을 활용한 테스트 자동 생성

**6. 반복적 개선**
- 성능 최적화
  - N+1 쿼리 해결 (eager loading, join)
  - 캐싱 전략
  - 인덱스 최적화
- 리팩토링
  - 중복 코드 제거
  - 전략 패턴 적용
  - 복잡도 감소
- 기술 부채 관리
  - 우선순위별 트래킹
  - 점진적 개선 계획

### 구현 완료 체크리스트

13주차를 마치면서 다음 항목들을 체크할 수 있어야 합니다:

**도메인 레이어**
- [ ] 엔티티와 Value Object 구현
- [ ] 도메인 로직과 비즈니스 규칙
- [ ] 도메인 이벤트 발행
- [ ] 외부 의존성 없음 검증

**애플리케이션 레이어**
- [ ] 모든 Use Case 구현
- [ ] 입력 검증 및 에러 처리
- [ ] 트랜잭션 관리
- [ ] 도메인 이벤트 구독

**인프라스트럭처 레이어**
- [ ] Repository 구현 (PostgreSQL + TypeORM)
- [ ] AI 서비스 통합 (OpenAI API)
- [ ] 캐싱 레이어 (Redis)
- [ ] 외부 API 통합

**프레젠테이션 레이어**
- [ ] RESTful API 엔드포인트
- [ ] WebSocket 실시간 통신
- [ ] 인증/인가 미들웨어
- [ ] Swagger API 문서

**품질 및 테스트**
- [ ] 단위 테스트 (커버리지 80%+)
- [ ] 통합 테스트 (E2E)
- [ ] 코드 리뷰 완료
- [ ] CI/CD 파이프라인 구축

**배포 준비**
- [ ] 환경 변수 설정 (.env)
- [ ] Docker 컨테이너화 (선택)
- [ ] 로깅 및 모니터링
- [ ] 에러 트래킹 (Sentry 등)

### Copilot 활용 성과

이번 주차에서 GitHub Copilot을 효과적으로 활용한 결과:

**개발 속도:**
- 보일러플레이트 코드 생성 시간: 80% 단축
- Repository 구현: 30분 → 5분
- 테스트 코드 작성: 50% 시간 절약

**코드 품질:**
- TypeScript 타입 안정성 향상
- 에러 처리 누락 감소
- 테스트 커버리지 향상

**학습 효과:**
- Clean Architecture 패턴 이해 심화
- 프롬프트 엔지니어링 기술 향상
- AI 협업 워크플로우 체득

### 실전 팁: Copilot과 효율적으로 일하기

**DO (권장사항):**
- ✅ 명확한 코딩 컨벤션 문서화 (.github/copilot-instructions.md)
- ✅ 예시 코드를 제공하여 패턴 학습시키기
- ✅ 생성된 코드를 단계별로 검증
- ✅ 복잡한 기능은 작은 단위로 나누어 요청
- ✅ Agent 모드로 연관 파일 함께 생성
- ✅ 테스트 코드도 Copilot으로 작성

**DON'T (주의사항):**
- ❌ 생성된 코드를 리뷰 없이 커밋
- ❌ 모호한 프롬프트로 여러 번 재시도
- ❌ 비즈니스 로직을 Copilot에게 전적으로 의존
- ❌ 보안 관련 코드를 검증 없이 사용
- ❌ 성능 최적화를 Copilot에게만 맡기기

### 다음 주 예고: 최종 프로젝트 발표 및 피드백

14주차에서는 구현한 프로젝트를 발표하고 피드백을 받습니다:
- 프로젝트 시연 준비
- 기술 발표 자료 작성
- 아키텍처 설명 및 의사결정 공유
- 동료 피드백 및 개선점 도출
- 바이브 코딩 여정 회고

지금까지 배운 모든 것을 종합하여 완성된 시스템을 선보이는 시간입니다. 여러분의 성장을 확인하고 축하하는 자리가 될 것입니다.

구현이 완료되었습니다. 여러분은 이제 AI와 함께 복잡한 시스템을 설계하고 구현할 수 있는 전문가입니다.
