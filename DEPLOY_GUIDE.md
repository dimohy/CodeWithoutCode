# GitHub Pages 배포 가이드

## 설정 완료된 항목

✅ mdBook 설치 및 설정
✅ `book.toml` 설정 파일 생성
✅ `SUMMARY.md` 목차 파일 생성
✅ GitHub Actions 워크플로우 설정
✅ `.gitignore` 파일 생성

---

## GitHub Pages 활성화 방법

1. **GitHub 저장소로 이동**
   - https://github.com/dimohy/CodeWithoutCode

2. **Settings 탭 클릭**

3. **Pages 메뉴 선택** (왼쪽 사이드바)

4. **Build and deployment 설정**
   - Source: `GitHub Actions` 선택

5. **코드 Push**
   ```powershell
   git add .
   git commit -m "Add mdBook e-book setup"
   git push origin main
   ```

6. **배포 확인**
   - Actions 탭에서 배포 진행 상황 확인
   - 완료 후 `https://dimohy.github.io/CodeWithoutCode/` 접속

---

## 로컬에서 미리보기

현재 로컬 서버가 실행 중입니다:
- URL: http://localhost:3000

변경사항이 자동으로 반영됩니다.

---

## 책 업데이트 방법

1. **마크다운 파일 수정**
   - `생각을 코드로/` 디렉토리 내의 챕터 파일 편집

2. **로컬 빌드 (선택사항)**
   ```powershell
   mdbook build
   ```

3. **GitHub에 Push**
   ```powershell
   git add .
   git commit -m "Update chapter content"
   git push origin main
   ```

4. **자동 배포**
   - GitHub Actions가 자동으로 빌드 및 배포

---

## 주요 파일 설명

- **`book.toml`**: mdBook 설정 파일
  - 책 제목, 저자, 언어 설정
  - 테마 및 검색 기능 설정
  
- **`생각을 코드로/SUMMARY.md`**: 목차 파일
  - 챕터 순서 및 구조 정의
  
- **`.github/workflows/deploy.yml`**: GitHub Actions 워크플로우
  - 자동 빌드 및 배포 설정

---

## 문제 해결

### mdbook 명령어가 인식되지 않을 때
PowerShell을 재시작하거나 전체 경로로 실행:
```powershell
& "C:\Users\dimohy\AppData\Local\Microsoft\WinGet\Packages\Rustlang.mdBook_Microsoft.Winget.Source_8wekyb3d8bbwe\mdbook.exe" build
```

### 배포가 실패할 때
- GitHub Actions 탭에서 오류 로그 확인
- Settings > Pages에서 Source가 "GitHub Actions"로 설정되었는지 확인

---

## 추가 커스터마이징

### 테마 변경
`book.toml`에서 `default-theme` 수정:
- `light`, `rust`, `coal`, `navy`, `ayu`

### 커스텀 CSS 추가
`생각을 코드로/theme/` 디렉토리 생성 후 CSS 파일 추가

### 플러그인 설치
mdBook은 다양한 플러그인 지원:
- `mdbook-mermaid`: 다이어그램
- `mdbook-toc`: 목차 자동 생성
- `mdbook-katex`: 수식 지원

---

**현재 상태**: 로컬 서버 실행 중 (http://localhost:3000)
**다음 단계**: GitHub에 Push하여 배포 활성화
