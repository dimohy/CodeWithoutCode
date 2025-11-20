// 인터페이스 분리 원칙 (ISP) 예시
// 거대한 인터페이스를 작은 인터페이스로 분리

// ❌ 나쁜 예: 거대한 인터페이스
interface User {
    authenticate(password: string): boolean;
    updateProfile(data: ProfileData): void;
    sendNotification(message: string): void;
    generateReport(): Report;
    exportToCSV(): string;
}

// ✅ 좋은 예: 작은 인터페이스들로 분리
interface Authenticatable {
    authenticate(password: string): boolean;
}

interface ProfileManager {
    updateProfile(data: ProfileData): void;
}

interface Notifiable {
    sendNotification(message: string): void;
}

interface Reportable {
    generateReport(): Report;
}

interface Exportable {
    exportToCSV(): string;
}

// 필요한 인터페이스만 구현
class BasicUser implements Authenticatable, ProfileManager {
    authenticate(password: string): boolean {
        // 인증 로직
        return true;
    }

    updateProfile(data: ProfileData): void {
        // 프로필 업데이트 로직
    }
}

class AdminUser implements Authenticatable, ProfileManager, Reportable {
    authenticate(password: string): boolean {
        // 관리자 인증 로직
        return true;
    }

    updateProfile(data: ProfileData): void {
        // 프로필 업데이트 로직
    }

    generateReport(): Report {
        // 보고서 생성 로직
        return {} as Report;
    }
}

type ProfileData = {
    name: string;
    email: string;
};

type Report = {
    title: string;
    data: any;
};
