// 설정 외부화 예시
// 하드코딩된 값 대신 설정 파일을 사용하여 환경별 차이 관리

interface DatabaseConfig {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    poolSize?: number;
    ssl?: boolean;
}

interface PaymentConfig {
    provider: string;
    apiKey: string;
    webhookUrl: string;
    timeout: number;
}

interface FeatureFlags {
    enableNewUI: boolean;
    enableBetaFeatures: boolean;
    maxUploadSize: number;
    maxConcurrentRequests: number;
}

interface LoggingConfig {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    outputs: ('console' | 'file' | 'remote')[];
}

interface AppConfig {
    environment: 'development' | 'staging' | 'production';
    database: DatabaseConfig;
    payment: PaymentConfig;
    features: FeatureFlags;
    logging: LoggingConfig;
    apiBaseUrl: string;
    corsOrigins: string[];
}

// 개발 환경 설정
const developmentConfig: AppConfig = {
    environment: 'development',
    database: {
        host: 'localhost',
        port: 5432,
        name: 'myapp_dev',
        username: 'dev_user',
        password: 'dev_password',
        poolSize: 5,
        ssl: false
    },
    payment: {
        provider: 'stripe',
        apiKey: 'sk_test_...',  // 테스트 키
        webhookUrl: 'http://localhost:3000/webhooks/payment',
        timeout: 5000
    },
    features: {
        enableNewUI: true,  // 개발 중인 기능 활성화
        enableBetaFeatures: true,
        maxUploadSize: 10 * 1024 * 1024,  // 10MB
        maxConcurrentRequests: 100
    },
    logging: {
        level: 'debug',  // 상세한 로그
        format: 'text',
        outputs: ['console']
    },
    apiBaseUrl: 'http://localhost:3000/api',
    corsOrigins: ['http://localhost:4200']  // 개발 프론트엔드
};

// 프로덕션 환경 설정
const productionConfig: AppConfig = {
    environment: 'production',
    database: {
        host: process.env.DB_HOST || 'db.example.com',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'myapp_prod',
        username: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || '',
        poolSize: 20,
        ssl: true
    },
    payment: {
        provider: 'stripe',
        apiKey: process.env.STRIPE_API_KEY || '',  // 환경변수에서 로드
        webhookUrl: 'https://api.example.com/webhooks/payment',
        timeout: 10000
    },
    features: {
        enableNewUI: false,  // 프로덕션에서는 안정된 기능만
        enableBetaFeatures: false,
        maxUploadSize: 5 * 1024 * 1024,  // 5MB
        maxConcurrentRequests: 1000
    },
    logging: {
        level: 'info',  // 필수 로그만
        format: 'json',
        outputs: ['file', 'remote']  // 파일과 원격 로그 서버
    },
    apiBaseUrl: 'https://api.example.com',
    corsOrigins: ['https://example.com', 'https://www.example.com']
};

// 설정 로더
class ConfigLoader {
    private static instance: ConfigLoader;
    private config: AppConfig;

    private constructor() {
        const env = process.env.NODE_ENV || 'development';
        this.config = this.loadConfig(env);
        this.validateConfig();
    }

    static getInstance(): ConfigLoader {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = new ConfigLoader();
        }
        return ConfigLoader.instance;
    }

    private loadConfig(environment: string): AppConfig {
        switch (environment) {
            case 'production':
                return productionConfig;
            case 'staging':
                return this.loadStagingConfig();
            case 'development':
            default:
                return developmentConfig;
        }
    }

    private loadStagingConfig(): AppConfig {
        // 스테이징은 프로덕션과 유사하지만 일부 차이
        return {
            ...productionConfig,
            environment: 'staging',
            database: {
                ...productionConfig.database,
                name: 'myapp_staging'
            },
            features: {
                ...productionConfig.features,
                enableBetaFeatures: true  // 스테이징에서는 베타 테스트
            },
            logging: {
                ...productionConfig.logging,
                level: 'debug'  // 스테이징에서는 상세 로그
            }
        };
    }

    private validateConfig(): void {
        const { database, payment } = this.config;

        if (!database.host || !database.name) {
            throw new Error('Database configuration is incomplete');
        }

        if (this.config.environment === 'production') {
            if (!payment.apiKey || payment.apiKey.includes('test')) {
                throw new Error('Invalid payment configuration for production');
            }
        }
    }

    getConfig(): AppConfig {
        return { ...this.config };  // 복사본 반환
    }

    get<K extends keyof AppConfig>(key: K): AppConfig[K] {
        return this.config[key];
    }
}

// 사용 예시
const config = ConfigLoader.getInstance();

console.log('Environment:', config.get('environment'));
console.log('Database host:', config.get('database').host);
console.log('Max upload size:', config.get('features').maxUploadSize);

// 특정 기능이 활성화되었는지 확인
if (config.get('features').enableNewUI) {
    console.log('New UI is enabled');
}

// 설정을 서비스에 주입
class DatabaseService {
    constructor(private dbConfig: DatabaseConfig) { }

    connect(): void {
        console.log(`Connecting to ${this.dbConfig.host}:${this.dbConfig.port}`);
        // 실제 연결 로직
    }
}

const dbService = new DatabaseService(config.get('database'));
dbService.connect();
