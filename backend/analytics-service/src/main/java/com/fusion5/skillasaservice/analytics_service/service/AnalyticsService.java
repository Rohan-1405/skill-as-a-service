package com.fusion5.skillasaservice.analytics_service.service;

import com.fusion5.skillasaservice.analytics_service.dto.response.*;
import com.fusion5.skillasaservice.analytics_service.entity.*;
import com.fusion5.skillasaservice.analytics_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private static final int TREND_MONTHS = 6;

    private final AuthUserRefRepository authUserRefRepository;
    private final SubscriptionRefRepository subscriptionRefRepository;
    private final PaymentRefRepository paymentRefRepository;
    private final RefundRefRepository refundRefRepository;
    private final FreelancerProfileRefRepository freelancerProfileRefRepository;
    private final KycDocumentRefRepository kycDocumentRefRepository;
    private final ProjectRefRepository projectRefRepository;
    private final WithdrawalRefRepository withdrawalRefRepository;

    // ── Freelancer ──────────────────────────────────────────────────────────

    public EarningsSummaryDto freelancerEarnings(Long freelancerId) {
        BigDecimal total = paymentRefRepository.totalEarningsForFreelancer(freelancerId);
        long count = paymentRefRepository.countByPayeeIdAndStatus(freelancerId, PaymentRef.PaymentStatus.COMPLETED);
        LocalDateTime since = sixMonthsAgo();
        List<MonthlyAmountDto> trend = paymentRefRepository.monthlyEarnings(freelancerId, since).stream()
                .map(this::toMonthlyAmount)
                .collect(Collectors.toList());
        return EarningsSummaryDto.builder()
                .totalEarnings(total).completedPaymentCount(count).monthlyTrend(trend).build();
    }

    public SubscriberSummaryDto freelancerSubscribers(Long freelancerId) {
        long active = subscriptionRefRepository.activeSubscriberCount(freelancerId);
        List<StatusCountDto> byStatus = subscriptionRefRepository.statusCountsForFreelancer(freelancerId).stream()
                .map(row -> new StatusCountDto(((SubscriptionRef.SubscriptionStatus) row[0]).name(), (Long) row[1]))
                .collect(Collectors.toList());
        return SubscriberSummaryDto.builder().activeSubscribers(active).byStatus(byStatus).build();
    }

    public ProfileViewsDto freelancerProfileViews(Long freelancerId) {
        long views = freelancerProfileRefRepository.findByUserId(freelancerId)
                .map(p -> p.getProfileViews() == null ? 0L : p.getProfileViews())
                .orElse(0L);
        return ProfileViewsDto.builder().profileViews(views).build();
    }

    public ProjectStatsDto freelancerProjects(Long freelancerId) {
        List<Object[]> rows = projectRefRepository.statusCountsForFreelancer(freelancerId);
        List<StatusCountDto> byStatus = rows.stream()
                .map(row -> new StatusCountDto(((ProjectRef.ProjectStatus) row[0]).name(), (Long) row[1]))
                .collect(Collectors.toList());
        long total = byStatus.stream().mapToLong(StatusCountDto::getCount).sum();
        return ProjectStatsDto.builder().totalProjects(total).byStatus(byStatus).build();
    }

    // ── Client ──────────────────────────────────────────────────────────────

    public ClientSubscriptionsDto clientSubscriptions(Long clientId) {
        List<Object[]> rows = subscriptionRefRepository.statusCountsForClient(clientId);
        List<StatusCountDto> byStatus = rows.stream()
                .map(row -> new StatusCountDto(((SubscriptionRef.SubscriptionStatus) row[0]).name(), (Long) row[1]))
                .collect(Collectors.toList());
        long total = byStatus.stream().mapToLong(StatusCountDto::getCount).sum();
        return ClientSubscriptionsDto.builder().totalSubscriptions(total).byStatus(byStatus).build();
    }

    public SpendingSummaryDto clientSpending(Long clientId) {
        BigDecimal total = paymentRefRepository.totalSpentByClient(clientId);
        long count = paymentRefRepository.countByPayerIdAndStatus(clientId, PaymentRef.PaymentStatus.COMPLETED);
        List<MonthlyAmountDto> trend = paymentRefRepository.monthlySpending(clientId, sixMonthsAgo()).stream()
                .map(this::toMonthlyAmount)
                .collect(Collectors.toList());
        return SpendingSummaryDto.builder()
                .totalSpent(total).completedPaymentCount(count).monthlyTrend(trend).build();
    }

    // ── Admin ───────────────────────────────────────────────────────────────

    public RevenueSummaryDto adminRevenue() {
        BigDecimal revenue = paymentRefRepository.platformTotalRevenue();
        BigDecimal refunded = refundRefRepository.totalRefunded();
        List<MonthlyAmountDto> trend = paymentRefRepository.monthlyPlatformRevenue(sixMonthsAgo()).stream()
                .map(this::toMonthlyAmount)
                .collect(Collectors.toList());
        return RevenueSummaryDto.builder()
                .totalRevenue(revenue)
                .totalRefunded(refunded)
                .netRevenue(revenue.subtract(refunded))
                .monthlyTrend(trend)
                .build();
    }

    public UserGrowthDto adminUsers() {
        long total = authUserRefRepository.count();
        long newLast30 = authUserRefRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(30));
        List<StatusCountDto> byStatus = List.of(
                new StatusCountDto("ACTIVE", authUserRefRepository.countByStatus(AuthUserRef.UserStatus.ACTIVE)),
                new StatusCountDto("INACTIVE", authUserRefRepository.countByStatus(AuthUserRef.UserStatus.INACTIVE)),
                new StatusCountDto("SUSPENDED", authUserRefRepository.countByStatus(AuthUserRef.UserStatus.SUSPENDED)),
                new StatusCountDto("BLOCKED", authUserRefRepository.countByStatus(AuthUserRef.UserStatus.BLOCKED))
        );
        List<MonthlyCountDto> trend = authUserRefRepository.monthlyRegistrations(sixMonthsAgo()).stream()
                .map(row -> new MonthlyCountDto((String) row[0], ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
        return UserGrowthDto.builder()
                .totalUsers(total).newLast30Days(newLast30).byStatus(byStatus).monthlyTrend(trend).build();
    }

    public KycStatsDto adminKyc() {
        long pending = kycDocumentRefRepository.countByVerificationStatus(KycDocumentRef.VerificationStatus.PENDING);
        List<StatusCountDto> byStatus = List.of(
                new StatusCountDto("PENDING", pending),
                new StatusCountDto("APPROVED", kycDocumentRefRepository.countByVerificationStatus(KycDocumentRef.VerificationStatus.APPROVED)),
                new StatusCountDto("REJECTED", kycDocumentRefRepository.countByVerificationStatus(KycDocumentRef.VerificationStatus.REJECTED))
        );
        List<Object[]> reviewed = kycDocumentRefRepository.reviewedTimestamps();
        Double avgHours = null;
        if (!reviewed.isEmpty()) {
            double avgMinutes = reviewed.stream()
                    .mapToLong(row -> Duration.between((LocalDateTime) row[0], (LocalDateTime) row[1]).toMinutes())
                    .average()
                    .orElse(0);
            avgHours = avgMinutes / 60.0;
        }
        return KycStatsDto.builder().pendingCount(pending).byStatus(byStatus).avgReviewTurnaroundHours(avgHours).build();
    }

    public TransactionStatsDto adminTransactions() {
        List<StatusCountAmountDto> payments = paymentRefRepository.statusCountsAndSums().stream()
                .map(row -> new StatusCountAmountDto(
                        ((PaymentRef.PaymentStatus) row[0]).name(), (Long) row[1], toBigDecimal(row[2])))
                .collect(Collectors.toList());
        List<StatusCountAmountDto> refunds = refundRefRepository.statusCountsAndSums().stream()
                .map(row -> new StatusCountAmountDto(
                        ((RefundRef.RefundStatus) row[0]).name(), (Long) row[1], toBigDecimal(row[2])))
                .collect(Collectors.toList());
        return TransactionStatsDto.builder().payments(payments).refunds(refunds).build();
    }

    public AdminDashboardDto adminDashboard() {
        return AdminDashboardDto.builder()
                .totalUsers(authUserRefRepository.count())
                .totalFreelancers(authUserRefRepository.countByRole("FREELANCER"))
                .totalClients(authUserRefRepository.countByRole("CLIENT"))
                .activeSubscriptions(subscriptionRefRepository.countByStatus(SubscriptionRef.SubscriptionStatus.ACTIVE))
                .totalRevenue(paymentRefRepository.platformTotalRevenue())
                .pendingKyc(kycDocumentRefRepository.countByVerificationStatus(KycDocumentRef.VerificationStatus.PENDING))
                .pendingWithdrawals(withdrawalRefRepository.countByStatus(WithdrawalRef.WithdrawalStatus.PENDING))
                .totalProjects(projectRefRepository.count())
                .build();
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private LocalDateTime sixMonthsAgo() {
        return LocalDateTime.now().minusMonths(TREND_MONTHS).withDayOfMonth(1).toLocalDate().atStartOfDay();
    }

    /** Native-query rows come back as raw Object[]; the numeric column type varies by
     *  JDBC driver (BigDecimal/BigInteger/Long), so cast defensively via Number. */
    private MonthlyAmountDto toMonthlyAmount(Object[] row) {
        String month = (String) row[0];
        return new MonthlyAmountDto(month, toBigDecimal(row[1]));
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) return bd;
        return new BigDecimal(((Number) value).toString());
    }
}
