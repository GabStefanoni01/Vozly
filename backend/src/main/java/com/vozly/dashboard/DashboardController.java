package com.vozly.dashboard;

import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
public class DashboardController {
    private static final int MAX_PAGE_SIZE = 100;
    private static final Duration MAX_USAGE_RANGE = Duration.ofDays(90);
    private final JdbcTemplate jdbc;

    public DashboardController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/tenants/current")
    public TenantResponse currentTenant(@AuthenticationPrincipal Jwt jwt) {
        UUID tenantId = tenantId(jwt);
        return jdbc.query("""
                SELECT id, name, slug, status, created_at
                FROM vozly.tenants
                WHERE id = ? AND status = 'ACTIVE'
                """, rs -> {
            if (!rs.next()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            return new TenantResponse(rs.getObject("id", UUID.class), rs.getString("name"),
                    rs.getString("slug"), rs.getString("status"),
                    rs.getObject("created_at", OffsetDateTime.class));
        }, tenantId);
    }

    @GetMapping("/onboarding")
    public OnboardingResponse onboarding(@AuthenticationPrincipal Jwt jwt) {
        UUID tenantId = tenantId(jwt);
        boolean workspace = exists("SELECT EXISTS(SELECT 1 FROM vozly.tenants WHERE id = ? AND status = 'ACTIVE')", tenantId);
        boolean members = exists("SELECT EXISTS(SELECT 1 FROM vozly.memberships WHERE tenant_id = ? AND status = 'ACTIVE')", tenantId);
        boolean agent = exists("SELECT EXISTS(SELECT 1 FROM vozly.agents WHERE tenant_id = ? AND status <> 'ARCHIVED')", tenantId);
        boolean knowledge = false; // Knowledge module has no persistence schema yet.
        boolean tools = false; // Tool bindings are not implemented yet.
        boolean phone = exists("SELECT EXISTS(SELECT 1 FROM vozly.phone_numbers WHERE tenant_id = ? AND status = 'ACTIVE')", tenantId);
        boolean test = false; // Test-session persistence is not implemented yet.
        boolean publish = exists("""
                SELECT EXISTS(SELECT 1 FROM vozly.agents
                WHERE tenant_id = ? AND status = 'ACTIVE' AND current_published_version_id IS NOT NULL)
                """, tenantId);

        List<OnboardingStep> steps = List.of(
                step("WORKSPACE", workspace, "O workspace precisa estar ativo."),
                step("MEMBERS", members, "Nenhum membro ativo foi encontrado no workspace."),
                step("AGENT", agent, "Crie um agente para continuar."),
                step("KNOWLEDGE", knowledge, "O módulo de conhecimento ainda não está disponível."),
                step("TOOLS", tools, "Configure ferramentas quando o módulo estiver disponível."),
                step("PHONE_NUMBER", phone, "Vincule um número telefônico ativo."),
                step("TEST", test, "A persistência das sessões de teste ainda não está disponível."),
                step("PUBLISH", publish, "Publique uma versão do agente."));
        OnboardingStep firstPending = steps.stream().filter(s -> !s.completed()).findFirst().orElse(null);
        return new OnboardingResponse(firstPending == null ? "COMPLETED" : "IN_PROGRESS",
                firstPending == null ? "PUBLISH" : firstPending.key(), steps);
    }

    @GetMapping("/agents")
    public PageResponse<AgentListItem> agents(@AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "updatedAt,desc") String sort) {
        UUID tenantId = tenantId(jwt);
        PageRequest request = pageRequest(page, size, sort, Map.of(
                "updatedAt", "a.updated_at", "name", "a.name", "createdAt", "a.created_at"));
        long total = count("SELECT COUNT(*) FROM vozly.agents a WHERE a.tenant_id = ? AND a.status <> 'ARCHIVED'", tenantId);
        List<AgentListItem> data = jdbc.query("""
                SELECT a.id, a.name, a.status, a.draft_revision, a.updated_at,
                       av.version_number AS published_version
                FROM vozly.agents a
                LEFT JOIN vozly.agent_versions av
                  ON av.tenant_id = a.tenant_id AND av.id = a.current_published_version_id
                WHERE a.tenant_id = ? AND a.status <> 'ARCHIVED'
                ORDER BY %s LIMIT ? OFFSET ?
                """.formatted(request.orderBy()), (rs, n) -> new AgentListItem(
                    rs.getObject("id", UUID.class), rs.getString("name"), rs.getString("status"),
                    rs.getInt("draft_revision"), (Integer) rs.getObject("published_version"),
                    rs.getObject("updated_at", OffsetDateTime.class)),
                tenantId, request.size(), request.offset());
        return new PageResponse<>(data, pagination(page, size, total));
    }

    @GetMapping("/phone-numbers")
    public PageResponse<PhoneNumberListItem> phoneNumbers(@AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        UUID tenantId = tenantId(jwt);
        PageRequest request = pageRequest(page, size, sort, Map.of(
                "createdAt", "p.created_at", "e164", "p.e164", "status", "p.status"));
        long total = count("SELECT COUNT(*) FROM vozly.phone_numbers p WHERE p.tenant_id = ?", tenantId);
        List<PhoneNumberListItem> data = jdbc.query("""
                SELECT p.id, p.e164, p.status, p.provider_key, p.agent_id, a.name AS agent_name
                FROM vozly.phone_numbers p
                LEFT JOIN vozly.agents a ON a.tenant_id = p.tenant_id AND a.id = p.agent_id
                WHERE p.tenant_id = ?
                ORDER BY %s LIMIT ? OFFSET ?
                """.formatted(request.orderBy()), (rs, n) -> new PhoneNumberListItem(
                    rs.getObject("id", UUID.class), rs.getString("e164"), rs.getString("status"),
                    rs.getString("provider_key"), rs.getObject("agent_id", UUID.class),
                    rs.getString("agent_name")),
                tenantId, request.size(), request.offset());
        return new PageResponse<>(data, pagination(page, size, total));
    }

    @GetMapping("/calls")
    public PageResponse<CallListItem> calls(@AuthenticationPrincipal Jwt jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "startedAt,desc") String sort) {
        UUID tenantId = tenantId(jwt);
        PageRequest request = pageRequest(page, size, sort, Map.of(
                "startedAt", "c.started_at", "durationSeconds", "duration_seconds"));
        long total = count("SELECT COUNT(*) FROM vozly.calls c WHERE c.tenant_id = ?", tenantId);
        List<CallListItem> data = jdbc.query("""
                SELECT c.id, c.agent_id, a.name AS agent_name, av.version_number,
                       p.e164 AS phone_number, c.caller_number, c.direction, c.status,
                       c.end_reason, c.started_at, c.ended_at,
                       CASE WHEN c.answered_at IS NULL THEN NULL
                            ELSE GREATEST(0, EXTRACT(EPOCH FROM (COALESCE(c.ended_at, CURRENT_TIMESTAMP) - c.answered_at)))::bigint
                       END AS duration_seconds
                FROM vozly.calls c
                JOIN vozly.agents a ON a.tenant_id = c.tenant_id AND a.id = c.agent_id
                JOIN vozly.agent_versions av ON av.tenant_id = c.tenant_id AND av.id = c.agent_version_id
                JOIN vozly.phone_numbers p ON p.tenant_id = c.tenant_id AND p.id = c.phone_number_id
                WHERE c.tenant_id = ?
                ORDER BY %s LIMIT ? OFFSET ?
                """.formatted(request.orderBy()), (rs, n) -> new CallListItem(
                    rs.getObject("id", UUID.class), rs.getObject("agent_id", UUID.class),
                    rs.getString("agent_name"), rs.getInt("version_number"), rs.getString("phone_number"),
                    maskPhone(rs.getString("caller_number")), rs.getString("direction"),
                    rs.getString("status"), rs.getString("end_reason"),
                    rs.getObject("started_at", OffsetDateTime.class),
                    rs.getObject("ended_at", OffsetDateTime.class),
                    (Long) rs.getObject("duration_seconds")),
                tenantId, request.size(), request.offset());
        return new PageResponse<>(data, pagination(page, size, total));
    }

    @GetMapping("/usage/summary")
    public UsageSummaryResponse usageSummary(@AuthenticationPrincipal Jwt jwt,
            @RequestParam OffsetDateTime from,
            @RequestParam OffsetDateTime to,
            @RequestParam(defaultValue = "DAY") String granularity) {
        UUID tenantId = tenantId(jwt);
        Instant start = from.toInstant();
        Instant end = to.toInstant();
        if (!"DAY".equals(granularity) || !start.isBefore(end)
                || Duration.between(start, end).compareTo(MAX_USAGE_RANGE) > 0) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "O intervalo deve ser crescente, de até 90 dias, com granularidade DAY.");
        }
        Duration period = Duration.between(start, end);
        Instant previousStart = start.minus(period);
        CallCounters current = counters(tenantId, start, end);
        CallCounters previous = counters(tenantId, previousStart, start);
        long inProgress = jdbc.queryForObject("""
                SELECT COUNT(*) FROM vozly.calls
                WHERE tenant_id = ? AND status IN ('ACTIVE', 'TRANSFERRING')
                """, Long.class, tenantId);
        DurationSummary duration = jdbc.queryForObject("""
                SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (COALESCE(ended_at, CURRENT_TIMESTAMP) - answered_at))), 0)::bigint AS total,
                       COALESCE(AVG(EXTRACT(EPOCH FROM (COALESCE(ended_at, CURRENT_TIMESTAMP) - answered_at))), 0)::double precision AS average
                FROM vozly.calls
                WHERE tenant_id = ? AND started_at >= ? AND started_at < ? AND answered_at IS NOT NULL
                """, (rs, n) -> new DurationSummary(rs.getLong("total"), rs.getDouble("average")),
                tenantId, start, end);
        List<EndReasonCount> reasons = jdbc.query("""
                SELECT end_reason, COUNT(*) AS total
                FROM vozly.calls
                WHERE tenant_id = ? AND started_at >= ? AND started_at < ? AND end_reason IS NOT NULL
                GROUP BY end_reason ORDER BY end_reason
                """, (rs, n) -> new EndReasonCount(rs.getString("end_reason"), rs.getLong("total")),
                tenantId, start, end);
        List<DailyUsage> series = jdbc.query("""
                WITH days AS (
                    SELECT generate_series(
                        date_trunc('day', ?::timestamptz AT TIME ZONE 'UTC'),
                        date_trunc('day', (?::timestamptz - interval '1 microsecond') AT TIME ZONE 'UTC'),
                        interval '1 day') AS day
                ), daily AS (
                    SELECT date_trunc('day', c.started_at AT TIME ZONE 'UTC') AS day,
                           COUNT(*) AS calls,
                           COALESCE(SUM(CASE WHEN c.answered_at IS NULL THEN 0
                               ELSE EXTRACT(EPOCH FROM (COALESCE(c.ended_at, CURRENT_TIMESTAMP) - c.answered_at)) END), 0) / 60.0 AS minutes
                    FROM vozly.calls c
                    WHERE c.tenant_id = ? AND c.started_at >= ? AND c.started_at < ?
                    GROUP BY 1
                )
                SELECT to_char(days.day, 'YYYY-MM-DD') AS date,
                       COALESCE(daily.calls, 0) AS calls,
                       COALESCE(daily.minutes, 0) AS minutes
                FROM days LEFT JOIN daily USING (day)
                ORDER BY days.day
                """, (rs, n) -> new DailyUsage(rs.getString("date"), rs.getLong("calls"),
                    rs.getDouble("minutes")), start, end, tenantId, start, end);

        return new UsageSummaryResponse(
                new Period(from.withOffsetSameInstant(ZoneOffset.UTC), to.withOffsetSameInstant(ZoneOffset.UTC)),
                current, previous, inProgress, duration, reasons, series);
    }

    private CallCounters counters(UUID tenantId, Instant from, Instant to) {
        return jdbc.queryForObject("""
                SELECT COUNT(*) AS total,
                       COUNT(*) FILTER (WHERE status = 'COMPLETED' AND end_reason <> 'TRANSFERRED') AS completed,
                       COUNT(*) FILTER (WHERE status = 'COMPLETED' AND end_reason = 'TRANSFERRED') AS transferred,
                       COUNT(*) FILTER (WHERE status IN ('FAILED', 'REJECTED', 'TIMED_OUT')) AS failed
                FROM vozly.calls
                WHERE tenant_id = ? AND started_at >= ? AND started_at < ?
                """, (rs, n) -> new CallCounters(rs.getLong("total"), rs.getLong("completed"),
                    rs.getLong("transferred"), rs.getLong("failed")), tenantId, from, to);
    }

    private boolean exists(String sql, UUID tenantId) {
        return Boolean.TRUE.equals(jdbc.queryForObject(sql, Boolean.class, tenantId));
    }

    private long count(String sql, UUID tenantId) {
        Long value = jdbc.queryForObject(sql, Long.class, tenantId);
        return value == null ? 0 : value;
    }

    private static UUID tenantId(Jwt jwt) {
        if (jwt == null || jwt.getClaimAsString("tenant_id") == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return UUID.fromString(jwt.getClaimAsString("tenant_id"));
    }

    private static PageRequest pageRequest(int page, int size, String sort, Map<String, String> allowed) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parâmetros de paginação inválidos.");
        String[] parts = sort.split(",", -1);
        if (parts.length != 2 || !allowed.containsKey(parts[0])
                || !("asc".equalsIgnoreCase(parts[1]) || "desc".equalsIgnoreCase(parts[1])))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ordenação não permitida.");
        return new PageRequest(size, Math.multiplyExact(page, size),
                allowed.get(parts[0]) + ("asc".equalsIgnoreCase(parts[1]) ? " ASC" : " DESC"));
    }

    private static Pagination pagination(int page, int size, long total) {
        return new Pagination(page, size, total, total == 0 ? 0 : (int) Math.ceil((double) total / size));
    }

    private static OnboardingStep step(String key, boolean completed, String reason) {
        return new OnboardingStep(key, completed, completed ? null : reason);
    }

    private static String maskPhone(String phone) {
        if (phone == null || phone.isBlank()) return null;
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() <= 4) return "••••";
        return "••••••" + digits.substring(digits.length() - 4);
    }

    public record TenantResponse(UUID id, String name, String slug, String status, OffsetDateTime createdAt) {}
    public record OnboardingResponse(String status, String currentStep, List<OnboardingStep> steps) {}
    public record OnboardingStep(String key, boolean completed, String pendingReason) {}
    public record PageResponse<T>(List<T> data, Pagination pagination) {}
    public record Pagination(int page, int size, long totalElements, int totalPages) {}
    public record AgentListItem(UUID id, String name, String status, int draftRevision,
                                Integer publishedVersion, OffsetDateTime updatedAt) {}
    public record PhoneNumberListItem(UUID id, String e164, String status, String providerKey,
                                      UUID agentId, String agentName) {}
    public record CallListItem(UUID id, UUID agentId, String agentName, int agentVersionNumber,
                                String phoneNumber, String callerNumberMasked, String direction,
                                String status, String endReason, OffsetDateTime startedAt,
                                OffsetDateTime endedAt, Long durationSeconds) {}
    public record CallCounters(long total, long completed, long transferred, long failed) {}
    public record Period(OffsetDateTime from, OffsetDateTime to) {}
    public record DurationSummary(long total, double average) {}
    public record EndReasonCount(String reason, long count) {}
    public record DailyUsage(String date, long calls, double minutes) {}
    public record UsageSummaryResponse(Period period, CallCounters calls, CallCounters previousCalls,
            long inProgress, DurationSummary durationSeconds, List<EndReasonCount> endReasons,
            List<DailyUsage> series) {}
    private record PageRequest(int size, int offset, String orderBy) {}
}
