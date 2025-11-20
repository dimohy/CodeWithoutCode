// 테스트 및 보안 검증 자동화 예시

// ============================================
// 1. 단위 테스트 - 제대로 된 검증
// ============================================

import { describe, it, expect } from '@jest/globals';

// 문제가 있는 테스트 - 너무 단순함
describe('UserService - Bad Tests', () => {
    it('should create user', async () => {
        const user = await userService.createUser({
            name: 'Test',
            email: 'test@example.com'
        });

        expect(user).toBeDefined(); // 너무 단순함!
    });
});

// 개선된 테스트 - 구체적인 검증
describe('UserService - Good Tests', () => {
    it('should create user with valid data', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass123!'
        };

        const user = await userService.createUser(userData);

        // 구체적인 검증
        expect(user.id).toBeDefined();
        expect(user.name).toBe(userData.name);
        expect(user.email).toBe(userData.email);
        expect(user.password).not.toBe(userData.password); // 해싱 확인
        expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when email already exists', async () => {
        await userService.createUser({
            name: 'Existing',
            email: 'existing@example.com',
            password: 'pass123'
        });

        await expect(
            userService.createUser({
                name: 'Duplicate',
                email: 'existing@example.com',
                password: 'pass456'
            })
        ).rejects.toThrow('Email already exists');
    });
});

// ============================================
// 2. 보안 테스트 - SQL Injection
// ============================================

describe('SQL Injection Security Tests', () => {
    it('should not be vulnerable to sql injection in user search', async () => {
        const maliciousInput = "' OR '1'='1";

        const result = await userService.searchByName(maliciousInput);

        // 결과가 모든 사용자를 반환하지 않아야 함
        expect(result.length).toBe(0);
    });

    it('should sanitize user input in comments', async () => {
        const xssAttempt = '<script>alert("XSS")</script>';

        const comment = await commentService.create({
            content: xssAttempt,
            userId: testUser.id
        });

        // 스크립트 태그가 제거되거나 이스케이프되어야 함
        expect(comment.content).not.toContain('<script>');
    });
});

// ============================================
// 3. 성능 테스트
// ============================================

describe('Performance Tests', () => {
    it('should load dashboard within 2 seconds', async () => {
        const startTime = Date.now();

        await dashboardService.loadDashboard(userId);

        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(2000);
    });

    it('should handle concurrent requests efficiently', async () => {
        const requests = Array(100).fill(null).map((_, i) =>
            orderService.createOrder({
                userId: `user-${i}`,
                items: mockItems
            })
        );

        const startTime = Date.now();
        await Promise.all(requests);
        const duration = Date.now() - startTime;

        // 100개 요청이 10초 이내 처리
        expect(duration).toBeLessThan(10000);
    });
});

// ============================================
// 4. 라이선스 체크 유틸리티 (개념 예시)
// ============================================

interface CodeOriginality {
    isOriginal: boolean;
    similarProjects: Array<{
        repo: string;
        license: string;
        similarity: number;
    }>;
}

async function checkCodeOriginality(code: string): Promise<CodeOriginality> {
    // 1. 코드의 핵심 시그니처 추출
    const signature = extractCodeSignature(code);

    // 2. GitHub 검색
    const searchResults = await githubSearch(signature);

    // 3. 유사도 분석
    const similarProjects = searchResults
        .filter(result => calculateSimilarity(code, result.code) > 0.8)
        .map(result => ({
            repo: result.repository,
            license: result.license,
            similarity: calculateSimilarity(code, result.code)
        }));

    return {
        isOriginal: similarProjects.length === 0,
        similarProjects
    };
}

// 사용 예시
const checkResult = await checkCodeOriginality(aiGeneratedCode);
if (!checkResult.isOriginal) {
    console.warn('유사한 코드 발견:', checkResult.similarProjects);
    // 라이선스 검토 필요
}

// ============================================
// 5. 민감 데이터 처리 - 안전한 방법
// ============================================

// 위험한 방법
const API_KEY_BAD = 'sk-1234567890abcdef'; // GitHub Copilot이 학습할 수 있음!

// 안전한 방법
const apiKey = process.env.API_KEY; // 환경 변수 사용
const dbPassword = process.env.DB_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

// 설정 클래스로 캡슐화
class SecureConfig {
    private static instance: SecureConfig;

    private readonly apiKey: string;
    private readonly dbPassword: string;

    private constructor() {
        this.apiKey = this.getRequiredEnv('API_KEY');
        this.dbPassword = this.getRequiredEnv('DB_PASSWORD');
    }

    static getInstance(): SecureConfig {
        if (!SecureConfig.instance) {
            SecureConfig.instance = new SecureConfig();
        }
        return SecureConfig.instance;
    }

    getApiKey(): string {
        return this.apiKey;
    }

    getDbPassword(): string {
        return this.dbPassword;
    }

    private getRequiredEnv(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Environment variable ${key} is required`);
        }
        return value;
    }
}

// ============================================
// 6. 학습 예시 - AI 없이 → AI 활용 → 비교
// ============================================

// Step 1: AI 없이 직접 구현
function myBinarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}

// Step 2: AI 생성 코드
function aiBinarySearch<T>(
    arr: T[],
    target: T,
    comparator: (a: T, b: T) => number = (a, b) => (a as any) - (b as any)
): number {
    if (arr.length === 0) return -1;

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2); // 오버플로우 방지
        const comparison = comparator(arr[mid], target);

        if (comparison === 0) return mid;
        if (comparison < 0) left = mid + 1;
        else right = mid - 1;
    }

    return -1;
}

/*
Step 3: 학습 포인트
1. 제네릭을 사용한 타입 안전성
2. 커스텀 비교 함수로 유연성 확보
3. (left + right) / 2 대신 left + (right - left) / 2로 오버플로우 방지
4. 빈 배열 엣지 케이스 처리
5. 함수 시그니처 설계의 중요성
*/
