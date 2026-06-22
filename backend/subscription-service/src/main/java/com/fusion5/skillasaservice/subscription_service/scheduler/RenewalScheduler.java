package com.fusion5.skillasaservice.subscription_service.scheduler;

import com.fusion5.skillasaservice.subscription_service.entity.Subscription;
import com.fusion5.skillasaservice.subscription_service.repository.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class RenewalScheduler {

    private static final Logger log = LoggerFactory.getLogger(RenewalScheduler.class);

    private final SubscriptionRepository subscriptionRepository;

    public RenewalScheduler(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Day 6 - Renewal cron job.
     * Runs daily at 01:00 AM.
     *
     * Two tasks:
     *  1. Mark ACTIVE subscriptions past their end_date as EXPIRED.
     *  2. Mark ACTIVE subscriptions reaching their renewal_date today as RENEWAL_DUE,
     *     so the client's dashboard can show a "renew now" prompt.
     *     (Actual payment for renewal follows the same purchase flow as a new subscription.)
     *
     * Note: fully automatic recurring billing without the client being present would
     * require Razorpay Subscriptions/mandates (a separate product from Razorpay orders).
     * That's a future enhancement; for now this cron flags the need and the client acts on it.
     */
    @Scheduled(cron = "0 0 1 * * *")  // 01:00 AM daily
    @Transactional
    public void processRenewals() {
        LocalDate today = LocalDate.now();
        log.info("RenewalScheduler: running for date {}", today);

        // 1. Expire subscriptions past their end date
        List<Subscription> expired = subscriptionRepository.findExpired(today);
        if (!expired.isEmpty()) {
            expired.forEach(s -> {
                s.setStatus(Subscription.SubscriptionStatus.EXPIRED);
                log.info("Subscription {} expired (end_date={})", s.getId(), s.getEndDate());
            });
            subscriptionRepository.saveAll(expired);
            log.info("RenewalScheduler: marked {} subscription(s) as EXPIRED", expired.size());
        }

        // 2. Flag subscriptions due for renewal today
        List<Subscription> dueForRenewal = subscriptionRepository.findDueForRenewal(today);
        if (!dueForRenewal.isEmpty()) {
            dueForRenewal.forEach(s -> {
                s.setStatus(Subscription.SubscriptionStatus.RENEWAL_DUE);
                log.info("Subscription {} flagged RENEWAL_DUE (renewal_date={})", s.getId(), s.getRenewalDate());
            });
            subscriptionRepository.saveAll(dueForRenewal);
            log.info("RenewalScheduler: marked {} subscription(s) as RENEWAL_DUE", dueForRenewal.size());
        }

        log.info("RenewalScheduler: completed");
    }
}
