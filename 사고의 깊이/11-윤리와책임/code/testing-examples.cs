// C# 테스트 및 학습 예시

using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace EthicsExamples.Tests
{
    // ============================================
    // 1. 보안 테스트 예시
    // ============================================

    public class SecurityTests
    {
        [Fact]
        public async Task GetUserByEmail_Should_PreventSqlInjection()
        {
            // Arrange
            var maliciousEmail = "' OR '1'='1' --";
            
            // Act
            var result = await _userService.GetUserByEmailAsync(maliciousEmail);
            
            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task CreatePost_Should_SanitizeHtmlContent()
        {
            // Arrange
            var xssAttempt = "<script>alert('XSS')</script><p>Safe content</p>";
            
            // Act
            var post = await _postService.CreateAsync(new CreatePostDto
            {
                Title = "Test",
                Content = xssAttempt,
                AuthorId = TestUser.Id
            });
            
            // Assert
            post.Content.Should().NotContain("<script>");
            post.Content.Should().Contain("Safe content");
        }

        [Fact]
        public async Task Login_Should_RateLimitAttempts()
        {
            // Arrange
            var loginDto = new LoginDto { Email = "test@example.com", Password = "wrong" };
            
            // Act - 연속 5회 실패 시도
            for (int i = 0; i < 5; i++)
            {
                await _authService.LoginAsync(loginDto);
            }
            
            // Assert - 6번째 시도는 차단되어야 함
            var act = async () => await _authService.LoginAsync(loginDto);
            await act.Should().ThrowAsync<TooManyRequestsException>();
        }
    }

    // ============================================
    // 2. 학습 예시 - 이해 → 설명 → 확장
    // ============================================

    // Step 1: AI 생성 코드
    public class CacheService<TKey, TValue> where TKey : notnull
    {
        private readonly ConcurrentDictionary<TKey, CacheEntry<TValue>> _cache = new();
        private readonly TimeSpan _defaultExpiration;
        
        public CacheService(TimeSpan defaultExpiration)
        {
            _defaultExpiration = defaultExpiration;
        }
        
        public void Set(TKey key, TValue value, TimeSpan? expiration = null)
        {
            var entry = new CacheEntry<TValue>
            {
                Value = value,
                ExpiresAt = DateTime.UtcNow.Add(expiration ?? _defaultExpiration)
            };
            _cache[key] = entry;
        }
        
        public bool TryGet(TKey key, out TValue value)
        {
            if (_cache.TryGetValue(key, out var entry) && entry.ExpiresAt > DateTime.UtcNow)
            {
                value = entry.Value;
                return true;
            }
            
            value = default!;
            return false;
        }
        
        // Step 3: 내가 추가한 기능 1 - 자동 정리
        public void RemoveExpired()
        {
            var now = DateTime.UtcNow;
            var expiredKeys = _cache
                .Where(kvp => kvp.Value.ExpiresAt <= now)
                .Select(kvp => kvp.Key)
                .ToList();
            
            foreach (var key in expiredKeys)
            {
                _cache.TryRemove(key, out _);
            }
        }
        
        // Step 3: 내가 추가한 기능 2 - 통계 정보
        public CacheStatistics GetStatistics()
        {
            var now = DateTime.UtcNow;
            return new CacheStatistics
            {
                TotalItems = _cache.Count,
                ExpiredItems = _cache.Count(kvp => kvp.Value.ExpiresAt <= now),
                ValidItems = _cache.Count(kvp => kvp.Value.ExpiresAt > now)
            };
        }
    }

    // Step 2: 학습 노트
    /*
    1. ConcurrentDictionary: 스레드 안전한 딕셔너리
    2. where TKey : notnull: null이 아닌 키만 허용 (C# 8.0+)
    3. TimeSpan?: Nullable 타입으로 기본값 사용 가능
    4. DateTime.UtcNow: 서버 시간대 독립적
    5. TryGet 패턴: 예외 대신 bool 반환 (성능 최적화)
    */

    public class CacheEntry<TValue>
    {
        public TValue Value { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public class CacheStatistics
    {
        public int TotalItems { get; set; }
        public int ExpiredItems { get; set; }
        public int ValidItems { get; set; }
    }
}
