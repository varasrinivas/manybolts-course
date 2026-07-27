import com.meridiancare.clinical.ClinicalCriteriaEvaluator;
import com.meridiancare.clinical.CriteriaRepository;
import com.meridiancare.priorauth.audit.AuditWindow;
import com.meridiancare.priorauth.audit.AuditWriter;
import com.meridiancare.priorauth.domain.AuthRequest;
import com.meridiancare.priorauth.domain.Determination;
import com.meridiancare.priorauth.domain.Member;
import com.meridiancare.priorauth.domain.Provider;
import com.meridiancare.priorauth.service.DeterminationService;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * Runs the assertion from
 * DeterminationServiceIT#concurrentDeterminationsKeepTheirOwnAuditWindow N times
 * and reports how often it fails. Same assertion, same thread count, no padding —
 * so the number here matches what surefire sees.
 *
 * <p>Usage: java FlakeProbe [runs]
 */
public final class FlakeProbe {

    private static final Map<String, Boolean> ALL_MET = Map.of(
            "CONSERVATIVE_THERAPY", true, "IMAGING_PRIOR", true, "AGE_BAND", true,
            "PROVIDER_ATTESTATION", true);

    public static void main(String[] args) throws Exception {
        int runs = args.length > 0 ? Integer.parseInt(args[0]) : 20;
        int failures = 0;
        for (int i = 0; i < runs; i++) {
            if (!singleRun()) {
                failures++;
            }
        }
        System.out.println("runs=" + runs + " failures=" + failures);
        System.out.println(failures >= 2 && failures <= 6
                ? "PD-6 in band (2-6 of 20)"
                : "PD-6 out of band - investigate before teaching M10");
    }

    private static boolean singleRun() throws Exception {
        DeterminationService service = new DeterminationService(
                new ClinicalCriteriaEvaluator(new CriteriaRepository()), new AuditWriter());

        int workers = 8;
        List<AuthRequest> requests = new ArrayList<>();
        for (int i = 0; i < workers; i++) {
            Member member = new Member("M-4471", LocalDate.of(1969, 4, 2), "PPO-2", "ACME",
                    Member.MemberStatus.ACTIVE, LocalDate.of(2020, 1, 1), null);
            Provider provider = new Provider("1245319599", "Lakeside Orthopaedics", "ORTHO", true);
            requests.add(new AuthRequest("AR-" + i, member, provider, "27447", ALL_MET,
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
                if (AuditWindow.of(requests.get(i).getReceivedAt())
                        != futures.get(i).get().getAuditWindow()) {
                    return false;
                }
            }
            return true;
        } finally {
            pool.shutdownNow();
        }
    }
}
