package com.meridiancare.priorauth.service;

import com.meridiancare.clinical.ClinicalCriteriaEvaluator;
import com.meridiancare.clinical.CriteriaRepository;
import com.meridiancare.priorauth.audit.AuditWindow;
import com.meridiancare.priorauth.audit.AuditWriter;
import com.meridiancare.priorauth.domain.AuthRequest;
import com.meridiancare.priorauth.domain.AuthStatus;
import com.meridiancare.priorauth.domain.Determination;
import com.meridiancare.priorauth.domain.Member;
import com.meridiancare.priorauth.domain.Provider;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DeterminationServiceIT {

    private final DeterminationService service = new DeterminationService(
            new ClinicalCriteriaEvaluator(new CriteriaRepository()), new AuditWriter());

    private AuthRequest request(String id, Map<String, Boolean> facts, Instant receivedAt) {
        Member member = new Member("M-4471", LocalDate.of(1969, 4, 2), "PPO-2",
                "ACME", Member.MemberStatus.ACTIVE, LocalDate.of(2020, 1, 1), null);
        Provider provider = new Provider("1245319599", "Lakeside Orthopaedics", "ORTHO", true);
        return new AuthRequest(id, member, provider, "27447", facts, receivedAt);
    }

    private static final Map<String, Boolean> ALL_MET = Map.of(
            "CONSERVATIVE_THERAPY", true, "IMAGING_PRIOR", true, "AGE_BAND", true,
            "PROVIDER_ATTESTATION", true);

    @Test
    void autoApprovesWhenAllRequiredCriteriaAreMet() {
        Determination d = service.decide(request("AR-1", ALL_MET, Instant.now()));
        assertEquals(AuthStatus.AUTO_APPROVED, d.getStatus());
    }

    @Test
    void routesToReviewWhenARequiredCriterionIsUnmet() {
        Determination d = service.decide(request("AR-2", Map.of(
                "CONSERVATIVE_THERAPY", true, "IMAGING_PRIOR", false, "AGE_BAND", true,
                "PROVIDER_ATTESTATION", true), Instant.now()));
        assertEquals(AuthStatus.IN_REVIEW, d.getStatus());
        assertTrue(d.getReasons().size() >= 1);
    }

    /**
     * Determinations are decided in parallel in production — the intake pool runs
     * eight workers. Each determination has to carry the audit batch window of
     * its own request, or the evidence export cannot reassemble the decision.
     */
    @Test
    void concurrentDeterminationsKeepTheirOwnAuditWindow() throws Exception {
        int workers = 8;
        List<AuthRequest> requests = new ArrayList<>();
        for (int i = 0; i < workers; i++) {
            // Requests arrive spread across batch windows, as they do in intake.
            requests.add(request("AR-" + i, ALL_MET,
                    Instant.now().minusMillis(i * AuditWindow.WINDOW_MILLIS)));
        }

        ExecutorService pool = Executors.newFixedThreadPool(workers);
        try {
            List<Callable<Determination>> work = new ArrayList<>();
            for (AuthRequest r : requests) {
                work.add(() -> service.decide(r));
            }
            List<Future<Determination>> futures = pool.invokeAll(work);

            for (int i = 0; i < workers; i++) {
                Determination d = futures.get(i).get();
                long expected = AuditWindow.of(requests.get(i).getReceivedAt());
                assertEquals(expected, d.getAuditWindow(),
                        "determination " + d.getRequestId()
                                + " carries another request's audit window");
            }
        } finally {
            pool.shutdownNow();
        }
    }
}
