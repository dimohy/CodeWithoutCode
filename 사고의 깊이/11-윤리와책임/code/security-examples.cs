// AI 생성 코드의 보안 검증 예시 (C#)

using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SecurityExamples
{
    // ============================================
    // 1. SQL Injection 방어
    // ============================================

    // 위험한 코드 - SQL Injection 취약점
    public class UserService_Vulnerable
    {
        private readonly DbContext _context;

        public async Task<User> GetUserByEmailAsync_Bad(string email)
        {
            var query = $"SELECT * FROM Users WHERE Email = '{email}'"; // 위험!
            return await _context.Users.FromSqlRaw(query).FirstOrDefaultAsync();
        }
    }

    // 안전한 코드 - 파라미터화된 쿼리
    public class UserService_Safe
    {
        private readonly DbContext _context;

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }
    }

    // ============================================
    // 2. 메모리 누수 방지
    // ============================================

    // 위험한 코드 - IDisposable 미처리
    public class ReportGenerator_Bad
    {
        public async Task<byte[]> GeneratePdfAsync(ReportData data)
        {
            var stream = new MemoryStream(); // Dispose 안 함!
            var document = new PdfDocument();
            
            // PDF 생성 로직...
            
            return stream.ToArray();
        }
    }

    // 안전한 코드 - using 문으로 리소스 관리
    public class ReportGenerator_Good
    {
        public async Task<byte[]> GeneratePdfAsync(ReportData data)
        {
            using var stream = new MemoryStream();
            using var document = new PdfDocument();
            
            // PDF 생성 로직...
            
            return stream.ToArray();
        }
    }

    // ============================================
    // 3. XSS 방어
    // ============================================

    public class PostService
    {
        private readonly IHtmlSanitizer _sanitizer;

        public async Task<Post> CreateAsync_Bad(CreatePostDto dto)
        {
            // 위험: HTML 콘텐츠를 그대로 저장
            var post = new Post
            {
                Title = dto.Title,
                Content = dto.Content, // XSS 취약점!
                AuthorId = dto.AuthorId
            };
            
            return await _context.Posts.AddAsync(post);
        }

        public async Task<Post> CreateAsync_Safe(CreatePostDto dto)
        {
            // 안전: HTML 살균 처리
            var post = new Post
            {
                Title = _sanitizer.Sanitize(dto.Title),
                Content = _sanitizer.Sanitize(dto.Content),
                AuthorId = dto.AuthorId
            };
            
            return await _context.Posts.AddAsync(post);
        }
    }

    // ============================================
    // 4. Rate Limiting
    // ============================================

    public class AuthService
    {
        private readonly IRateLimiter _rateLimiter;
        private readonly IPasswordHasher _passwordHasher;

        public async Task<LoginResult> LoginAsync_WithoutRateLimit(LoginDto dto)
        {
            // 위험: 무제한 로그인 시도 허용 (브루트 포스 공격 취약)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            if (user == null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
            {
                return LoginResult.Failed();
            }
            
            return LoginResult.Success(user);
        }

        public async Task<LoginResult> LoginAsync_WithRateLimit(LoginDto dto)
        {
            // 안전: Rate Limiting 적용
            var ipAddress = GetClientIpAddress();
            
            if (!await _rateLimiter.IsAllowedAsync(ipAddress))
            {
                throw new TooManyRequestsException("Too many login attempts. Try again later.");
            }
            
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            if (user == null || !_passwordHasher.Verify(dto.Password, user.PasswordHash))
            {
                await _rateLimiter.IncrementFailedAttemptsAsync(ipAddress);
                return LoginResult.Failed();
            }
            
            await _rateLimiter.ResetAsync(ipAddress);
            return LoginResult.Success(user);
        }
    }

    // ============================================
    // 5. 민감 데이터 로깅 방지
    // ============================================

    public class PaymentController
    {
        private readonly ILogger _logger;

        public async Task<PaymentResult> ProcessPayment_Bad(PaymentRequest request)
        {
            // 위험: 카드 정보를 로그에 기록
            _logger.LogInformation($"Processing payment: {request.CardNumber}"); // 절대 하면 안 됨!
            
            return await _paymentGateway.ProcessAsync(request);
        }

        public async Task<PaymentResult> ProcessPayment_Safe(PaymentRequest request)
        {
            // 안전: 민감 정보는 마스킹하거나 제외
            _logger.LogInformation($"Processing payment: ****{request.CardNumber.Substring(request.CardNumber.Length - 4)}");
            
            return await _paymentGateway.ProcessAsync(request);
        }
    }
}
