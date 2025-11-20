// 할 일 관리 시스템 설계 실습 - 전체 코드

// ============= 도메인 모델 =============

// 값 객체 (타입 안전성)
type ProjectId = string & { __brand: 'ProjectId' };
type TodoId = string & { __brand: 'TodoId' };
type UserId = string & { __brand: 'UserId' };

enum TodoStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done'
}

enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

enum ProjectStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    ARCHIVED = 'archived'
}

// 엔티티
interface Project {
    id: ProjectId;
    name: string;
    description: string;
    owner: UserId;
    members: UserId[];
    createdAt: Date;
    status: ProjectStatus;
}

interface Todo {
    id: TodoId;
    projectId: ProjectId;
    title: string;
    description: string;
    assignee: UserId | null;
    status: TodoStatus;
    priority: Priority;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface User {
    id: UserId;
    email: string;
    name: string;
    avatar: string;
}

// ============= 도메인 이벤트 =============

interface DomainEvent {
    eventId: string;
    occurredAt: Date;
}

interface ProjectCreated extends DomainEvent {
    type: 'ProjectCreated';
    projectId: ProjectId;
    ownerId: UserId;
}

interface TodoAssigned extends DomainEvent {
    type: 'TodoAssigned';
    todoId: TodoId;
    assigneeId: UserId;
    projectId: ProjectId;
}

interface TodoStatusChanged extends DomainEvent {
    type: 'TodoStatusChanged';
    todoId: TodoId;
    oldStatus: TodoStatus;
    newStatus: TodoStatus;
}

// ============= Repository 인터페이스 =============

interface ProjectRepository {
    findById(id: ProjectId): Promise<Project | null>;
    findByOwner(userId: UserId): Promise<Project[]>;
    findByMember(userId: UserId): Promise<Project[]>;
    save(project: Project): Promise<void>;
    delete(id: ProjectId): Promise<void>;
}

interface TodoRepository {
    findById(id: TodoId): Promise<Todo | null>;
    findByProject(projectId: ProjectId): Promise<Todo[]>;
    findByAssignee(userId: UserId): Promise<Todo[]>;
    findOverdue(): Promise<Todo[]>;
    save(todo: Todo): Promise<void>;
    delete(id: TodoId): Promise<void>;
}

interface UserRepository {
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
}

// ============= 인프라스트럭처 서비스 =============

interface EventPublisher {
    publish(event: DomainEvent): Promise<void>;
}

interface EmailService {
    sendAssignmentNotification(userId: UserId, todo: Todo): Promise<void>;
    sendDueDateReminder(userId: UserId, todo: Todo): Promise<void>;
}

// ============= 도메인 에러 =============

class TodoNotFoundError extends Error {
    constructor(todoId: TodoId) {
        super(`Todo not found: ${todoId}`);
        this.name = 'TodoNotFoundError';
    }
}

class ProjectNotFoundError extends Error {
    constructor(projectId: ProjectId) {
        super(`Project not found: ${projectId}`);
        this.name = 'ProjectNotFoundError';
    }
}

class NotProjectMemberError extends Error {
    constructor(userId: UserId, projectId: ProjectId) {
        super(`User ${userId} is not a member of project ${projectId}`);
        this.name = 'NotProjectMemberError';
    }
}

class ProjectCompletedError extends Error {
    constructor(projectId: ProjectId) {
        super(`Cannot modify completed project: ${projectId}`);
        this.name = 'ProjectCompletedError';
    }
}

// ============= Use Cases =============

// AssignTodoUseCase - 할 일 할당
class AssignTodoUseCase {
    constructor(
        private todoRepository: TodoRepository,
        private projectRepository: ProjectRepository,
        private eventPublisher: EventPublisher,
        private emailService: EmailService
    ) { }

    async execute(todoId: TodoId, assigneeId: UserId): Promise<void> {
        // 할 일 조회
        const todo = await this.todoRepository.findById(todoId);
        if (!todo) {
            throw new TodoNotFoundError(todoId);
        }

        // 프로젝트 조회
        const project = await this.projectRepository.findById(todo.projectId);
        if (!project) {
            throw new ProjectNotFoundError(todo.projectId);
        }

        // 도메인 규칙 검증: 프로젝트 멤버만 할당 가능
        if (!project.members.includes(assigneeId)) {
            throw new NotProjectMemberError(assigneeId, project.id);
        }

        // 도메인 규칙 검증: 완료된 프로젝트는 수정 불가
        if (project.status === ProjectStatus.COMPLETED) {
            throw new ProjectCompletedError(project.id);
        }

        // 할 일 할당
        todo.assignee = assigneeId;
        todo.updatedAt = new Date();

        // 저장
        await this.todoRepository.save(todo);

        // 이벤트 발행
        await this.eventPublisher.publish({
            type: 'TodoAssigned',
            eventId: crypto.randomUUID(),
            occurredAt: new Date(),
            todoId: todo.id,
            assigneeId,
            projectId: project.id
        });

        // 알림 발송
        await this.emailService.sendAssignmentNotification(assigneeId, todo);
    }
}

// CreateProjectUseCase - 프로젝트 생성
class CreateProjectUseCase {
    constructor(
        private projectRepository: ProjectRepository,
        private eventPublisher: EventPublisher
    ) { }

    async execute(name: string, description: string, ownerId: UserId): Promise<ProjectId> {
        const projectId = crypto.randomUUID() as ProjectId;

        const project: Project = {
            id: projectId,
            name,
            description,
            owner: ownerId,
            members: [ownerId],  // 생성자는 자동으로 멤버
            createdAt: new Date(),
            status: ProjectStatus.ACTIVE
        };

        await this.projectRepository.save(project);

        await this.eventPublisher.publish({
            type: 'ProjectCreated',
            eventId: crypto.randomUUID(),
            occurredAt: new Date(),
            projectId,
            ownerId
        });

        return projectId;
    }
}

// UpdateTodoStatusUseCase - 할 일 상태 변경
class UpdateTodoStatusUseCase {
    constructor(
        private todoRepository: TodoRepository,
        private projectRepository: ProjectRepository,
        private eventPublisher: EventPublisher
    ) { }

    async execute(todoId: TodoId, newStatus: TodoStatus): Promise<void> {
        const todo = await this.todoRepository.findById(todoId);
        if (!todo) {
            throw new TodoNotFoundError(todoId);
        }

        const project = await this.projectRepository.findById(todo.projectId);
        if (!project) {
            throw new ProjectNotFoundError(todo.projectId);
        }

        if (project.status === ProjectStatus.COMPLETED) {
            throw new ProjectCompletedError(project.id);
        }

        const oldStatus = todo.status;
        todo.status = newStatus;
        todo.updatedAt = new Date();

        await this.todoRepository.save(todo);

        await this.eventPublisher.publish({
            type: 'TodoStatusChanged',
            eventId: crypto.randomUUID(),
            occurredAt: new Date(),
            todoId: todo.id,
            oldStatus,
            newStatus
        });
    }
}

// ============= 테스트 코드 예시 =============

// Mock 구현
class MockTodoRepository implements TodoRepository {
    private todos = new Map<TodoId, Todo>();

    async findById(id: TodoId): Promise<Todo | null> {
        return this.todos.get(id) || null;
    }

    async findByProject(projectId: ProjectId): Promise<Todo[]> {
        return Array.from(this.todos.values())
            .filter(todo => todo.projectId === projectId);
    }

    async findByAssignee(userId: UserId): Promise<Todo[]> {
        return Array.from(this.todos.values())
            .filter(todo => todo.assignee === userId);
    }

    async findOverdue(): Promise<Todo[]> {
        const now = new Date();
        return Array.from(this.todos.values())
            .filter(todo => todo.dueDate && todo.dueDate < now && todo.status !== TodoStatus.DONE);
    }

    async save(todo: Todo): Promise<void> {
        this.todos.set(todo.id, { ...todo });
    }

    async delete(id: TodoId): Promise<void> {
        this.todos.delete(id);
    }
}

// 테스트 예시 (개념적)
/*
describe('AssignTodoUseCase', () => {
  let useCase: AssignTodoUseCase;
  let todoRepository: MockTodoRepository;
  let projectRepository: MockProjectRepository;

  it('should assign todo to project member', async () => {
    const project = createProject({ members: [userId1, userId2] });
    const todo = createTodo({ projectId: project.id });
    
    await useCase.execute(todo.id, userId2);
    
    expect(todo.assignee).toBe(userId2);
  });

  it('should throw error when assigning to non-member', async () => {
    const project = createProject({ members: [userId1] });
    const todo = createTodo({ projectId: project.id });
    
    await expect(useCase.execute(todo.id, userId2))
      .rejects.toThrow(NotProjectMemberError);
  });
});
*/
