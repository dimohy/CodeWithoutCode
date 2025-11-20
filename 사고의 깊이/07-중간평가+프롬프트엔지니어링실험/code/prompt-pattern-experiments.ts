// 프롬프트 패턴 실험 - 이벤트 기반 알림 시스템

// ============= 실험 1: 간결형 프롬프트 결과 =============

// 프롬프트: "이벤트 기반 알림 시스템을 구현해줘. TypeScript로."

class SimpleNotificationService {
  async sendNotification(event: string, channel: string, user: User) {
    if (channel === 'email') {
      await this.sendEmail(user.email, event);
    } else if (channel === 'sms') {
      await this.sendSMS(user.phone, event);
    } else if (channel === 'push') {
      await this.sendPush(user.deviceToken, event);
    }
  }
  
  private async sendEmail(to: string, content: string): Promise<void> {
    console.log(`Email to ${to}: ${content}`);
  }
  
  private async sendSMS(to: string, content: string): Promise<void> {
    console.log(`SMS to ${to}: ${content}`);
  }
  
  private async sendPush(token: string, content: string): Promise<void> {
    console.log(`Push to ${token}: ${content}`);
  }
}

// 특징: 단순하지만 확장성과 유지보수성이 낮음
// if-else 체인, 단일 클래스에 모든 로직

// ============= 실험 2: 상세형 프롬프트 결과 =============

// 프롬프트: "이벤트 기반 알림 시스템... (요구사항 10개 나열)"

interface Event {
  eventType: string;
  payload: any;
  timestamp: Date;
}

interface NotificationChannel {
  send(user: User, message: string): Promise<void>;
  getName(): string;
}

interface User {
  id: string;
  email: string;
  phone: string;
  deviceToken?: string;
  notificationPreferences: Record<string, boolean>;
}

// Strategy 패턴으로 채널 추상화
class EmailChannel implements NotificationChannel {
  getName(): string {
    return 'email';
  }
  
  async send(user: User, message: string): Promise<void> {
    console.log(`Sending email to ${user.email}: ${message}`);
    // 실제 이메일 발송 로직
  }
}

class SMSChannel implements NotificationChannel {
  getName(): string {
    return 'sms';
  }
  
  async send(user: User, message: string): Promise<void> {
    console.log(`Sending SMS to ${user.phone}: ${message}`);
    // 실제 SMS 발송 로직
  }
}

class PushChannel implements NotificationChannel {
  getName(): string {
    return 'push';
  }
  
  async send(user: User, message: string): Promise<void> {
    if (!user.deviceToken) {
      throw new Error('Device token not available');
    }
    console.log(`Sending push to ${user.deviceToken}: ${message}`);
    // 실제 푸시 알림 로직
  }
}

// Observer + Strategy 패턴 결합
class DetailedNotificationService {
  private subscriptions: Map<string, NotificationChannel[]> = new Map();
  
  subscribe(eventType: string, channel: NotificationChannel): void {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }
    this.subscriptions.get(eventType)!.push(channel);
  }
  
  unsubscribe(eventType: string, channel: NotificationChannel): void {
    const channels = this.subscriptions.get(eventType);
    if (!channels) return;
    
    const index = channels.indexOf(channel);
    if (index > -1) {
      channels.splice(index, 1);
    }
  }
  
  async publish(event: Event, users: User[]): Promise<void> {
    const channels = this.subscriptions.get(event.eventType) || [];
    
    for (const user of users) {
      const userChannels = this.getUserEnabledChannels(user, channels);
      
      for (const channel of userChannels) {
        await this.sendWithRetry(channel, user, event, 3);
      }
    }
  }
  
  private async sendWithRetry(
    channel: NotificationChannel,
    user: User,
    event: Event,
    maxRetries: number
  ): Promise<void> {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        await channel.send(user, this.formatMessage(event));
        await this.saveHistory(user, channel, event, 'success');
        return;
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          await this.saveHistory(user, channel, event, 'failed');
          throw error;
        }
        // 지수 백오프
        await this.delay(Math.pow(2, attempts) * 1000);
      }
    }
  }
  
  private getUserEnabledChannels(
    user: User,
    channels: NotificationChannel[]
  ): NotificationChannel[] {
    return channels.filter(channel => 
      user.notificationPreferences[channel.getName()] !== false
    );
  }
  
  private async saveHistory(
    user: User,
    channel: NotificationChannel,
    event: Event,
    status: string
  ): Promise<void> {
    console.log(`Saving history: ${user.id} - ${channel.getName()} - ${status}`);
    // DB에 이력 저장
  }
  
  private formatMessage(event: Event): string {
    return JSON.stringify(event.payload);
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 특징: 확장 가능한 구조, 재시도 로직, 사용자 설정 고려
// 하지만 단일 파일에 모든 구현이 있어 복잡함

// ============= 실험 3: 구조 지정형 프롬프트 결과 =============

// 프롬프트: "Clean Architecture로... Domain/Application/Infrastructure 분리"

// Domain Layer
namespace Domain {
  export enum EventType {
    ORDER_CREATED = 'order.created',
    PAYMENT_COMPLETED = 'payment.completed',
    SHIPPING_STARTED = 'shipping.started'
  }

  export interface DomainEvent {
    id: string;
    type: EventType;
    payload: unknown;
    occurredAt: Date;
  }

  export interface NotificationPreference {
    channelType: string;
    enabled: boolean;
  }

  export class Notification {
    constructor(
      public readonly id: string,
      public readonly userId: string,
      public readonly channelType: string,
      public readonly content: string,
      public readonly sentAt: Date,
      public status: 'pending' | 'sent' | 'failed'
    ) {}

    markAsSent(): void {
      this.status = 'sent';
    }

    markAsFailed(): void {
      this.status = 'failed';
    }
  }
}

// Application Layer
namespace Application {
  export interface INotificationChannel {
    send(userId: string, content: string): Promise<void>;
    getType(): string;
  }

  export interface INotificationRepository {
    save(notification: Domain.Notification): Promise<void>;
    findByUserId(userId: string): Promise<Domain.Notification[]>;
  }

  export interface IEventBus {
    subscribe(eventType: Domain.EventType, handler: EventHandler): void;
    publish(event: Domain.DomainEvent): Promise<void>;
  }

  export type EventHandler = (event: Domain.DomainEvent) => Promise<void>;

  export class SendNotificationUseCase {
    constructor(
      private channels: Map<string, INotificationChannel>,
      private notificationRepo: INotificationRepository
    ) {}

    async execute(
      userId: string,
      channelType: string,
      content: string
    ): Promise<void> {
      const channel = this.channels.get(channelType);
      if (!channel) {
        throw new Error(`Channel not found: ${channelType}`);
      }

      const notification = new Domain.Notification(
        crypto.randomUUID(),
        userId,
        channelType,
        content,
        new Date(),
        'pending'
      );

      try {
        await channel.send(userId, content);
        notification.markAsSent();
      } catch (error) {
        notification.markAsFailed();
        throw error;
      } finally {
        await this.notificationRepo.save(notification);
      }
    }
  }

  export class NotificationEventHandler {
    constructor(
      private sendNotificationUseCase: SendNotificationUseCase,
      private getUserPreferences: (userId: string) => Promise<Domain.NotificationPreference[]>
    ) {}

    async handle(event: Domain.DomainEvent, targetUsers: string[]): Promise<void> {
      for (const userId of targetUsers) {
        const preferences = await this.getUserPreferences(userId);
        const enabledChannels = preferences.filter(p => p.enabled);

        for (const pref of enabledChannels) {
          await this.sendNotificationUseCase.execute(
            userId,
            pref.channelType,
            this.formatContent(event)
          );
        }
      }
    }

    private formatContent(event: Domain.DomainEvent): string {
      return `Event: ${event.type} - ${JSON.stringify(event.payload)}`;
    }
  }
}

// Infrastructure Layer
namespace Infrastructure {
  export class EmailNotificationChannel implements Application.INotificationChannel {
    getType(): string {
      return 'email';
    }

    async send(userId: string, content: string): Promise<void> {
      console.log(`Email sent to user ${userId}: ${content}`);
      // 실제 이메일 서비스 호출
    }
  }

  export class InMemoryNotificationRepository implements Application.INotificationRepository {
    private notifications: Domain.Notification[] = [];

    async save(notification: Domain.Notification): Promise<void> {
      this.notifications.push(notification);
    }

    async findByUserId(userId: string): Promise<Domain.Notification[]> {
      return this.notifications.filter(n => n.userId === userId);
    }
  }

  export class SimpleEventBus implements Application.IEventBus {
    private handlers: Map<Domain.EventType, Application.EventHandler[]> = new Map();

    subscribe(eventType: Domain.EventType, handler: Application.EventHandler): void {
      if (!this.handlers.has(eventType)) {
        this.handlers.set(eventType, []);
      }
      this.handlers.get(eventType)!.push(handler);
    }

    async publish(event: Domain.DomainEvent): Promise<void> {
      const handlers = this.handlers.get(event.type) || [];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }
}

// 특징: 계층 분리가 명확, 테스트 가능, 확장 가능
// 하지만 코드량이 많고 초기 설정이 복잡함
