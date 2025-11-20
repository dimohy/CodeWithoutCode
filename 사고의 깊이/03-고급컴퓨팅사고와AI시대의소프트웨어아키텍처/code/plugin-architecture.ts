// 플러그인 아키텍처 예시
// 핵심 시스템은 안정적으로 유지하고, 확장 기능은 플러그인으로 분리

interface PluginContext {
    data: any;
    config: Record<string, any>;
    logger: Logger;
}

interface Logger {
    info(message: string): void;
    error(message: string, error?: Error): void;
}

interface Plugin {
    name: string;
    version: string;
    initialize(): void;
    execute(context: PluginContext): Promise<void>;
    cleanup?(): void;
}

class PluginManager {
    private plugins: Map<string, Plugin> = new Map();
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    register(plugin: Plugin): void {
        if (this.plugins.has(plugin.name)) {
            throw new Error(`Plugin ${plugin.name} is already registered`);
        }

        try {
            plugin.initialize();
            this.plugins.set(plugin.name, plugin);
            this.logger.info(`Plugin registered: ${plugin.name} v${plugin.version}`);
        } catch (error) {
            this.logger.error(`Failed to initialize plugin ${plugin.name}`, error as Error);
            throw error;
        }
    }

    unregister(pluginName: string): void {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} not found`);
        }

        if (plugin.cleanup) {
            plugin.cleanup();
        }
        this.plugins.delete(pluginName);
        this.logger.info(`Plugin unregistered: ${pluginName}`);
    }

    async executeAll(context: PluginContext): Promise<void> {
        for (const [name, plugin] of this.plugins) {
            try {
                await plugin.execute(context);
            } catch (error) {
                this.logger.error(`Plugin ${name} execution failed`, error as Error);
                // 한 플러그인 실패가 전체 실행을 멈추지 않도록
            }
        }
    }

    async execute(pluginName: string, context: PluginContext): Promise<void> {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} not found`);
        }

        await plugin.execute(context);
    }

    getPlugin(pluginName: string): Plugin | undefined {
        return this.plugins.get(pluginName);
    }

    listPlugins(): Plugin[] {
        return Array.from(this.plugins.values());
    }
}

// 구체적인 플러그인 예시

class EmailNotificationPlugin implements Plugin {
    name = 'email-notification';
    version = '1.0.0';
    private emailService: any;

    initialize(): void {
        // 이메일 서비스 초기화
        console.log('Email notification plugin initialized');
    }

    async execute(context: PluginContext): Promise<void> {
        const { data, config } = context;

        if (data.event === 'order.created') {
            await this.sendOrderConfirmation(data.order, config.email);
        }
    }

    private async sendOrderConfirmation(order: any, emailConfig: any): Promise<void> {
        console.log(`Sending order confirmation email for order ${order.id}`);
        // 실제 이메일 발송 로직
    }

    cleanup(): void {
        console.log('Email notification plugin cleaned up');
    }
}

class LoggingPlugin implements Plugin {
    name = 'logging';
    version = '1.0.0';

    initialize(): void {
        console.log('Logging plugin initialized');
    }

    async execute(context: PluginContext): Promise<void> {
        const { data, logger } = context;
        logger.info(`Event occurred: ${data.event}`);
        logger.info(`Data: ${JSON.stringify(data)}`);
    }
}

class AnalyticsPlugin implements Plugin {
    name = 'analytics';
    version = '1.0.0';

    initialize(): void {
        console.log('Analytics plugin initialized');
    }

    async execute(context: PluginContext): Promise<void> {
        const { data } = context;
        // 분석 데이터 수집
        console.log(`Tracking event: ${data.event}`);
    }
}

// 사용 예시
const logger: Logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg, err) => console.error(`[ERROR] ${msg}`, err)
};

const manager = new PluginManager(logger);

// 플러그인 등록
manager.register(new EmailNotificationPlugin());
manager.register(new LoggingPlugin());
manager.register(new AnalyticsPlugin());

// 모든 플러그인 실행
const context: PluginContext = {
    data: { event: 'order.created', order: { id: '12345' } },
    config: { email: { from: 'noreply@example.com' } },
    logger
};

manager.executeAll(context);
