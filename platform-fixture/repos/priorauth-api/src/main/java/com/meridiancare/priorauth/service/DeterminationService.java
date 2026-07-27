package com.meridiancare.priorauth.service;

import com.meridiancare.clinical.ClinicalCriteriaEvaluator;
import com.meridiancare.clinical.CriteriaEvaluation;
import com.meridiancare.priorauth.audit.AuditWindow;
import com.meridiancare.priorauth.audit.AuditWriter;
import com.meridiancare.priorauth.domain.AuthRequest;
import com.meridiancare.priorauth.domain.AuthStatus;
import com.meridiancare.priorauth.domain.Determination;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Produces a {@link Determination} for a request.
 *
 * <p>The only writer of {@code Determination} and {@code AuthStatus} on the
 * platform.
 */
public class DeterminationService {

    /** Statutory turnaround for a standard request. */
    private static final int STANDARD_TURNAROUND_DAYS = 14;

    private final ClinicalCriteriaEvaluator evaluator;
    private final AuditWriter auditWriter;

    /**
     * Audit window for the request being decided.
     *
     * <p>Held here so the audit interceptor can read it without every call site
     * threading it through. Set at the start of {@link #decide}.
     */
    private long currentAuditWindow;

    public DeterminationService(ClinicalCriteriaEvaluator evaluator, AuditWriter auditWriter) {
        this.evaluator = evaluator;
        this.auditWriter = auditWriter;
    }

    public Determination decide(AuthRequest request) {
        currentAuditWindow = AuditWindow.of(request.getReceivedAt());

        CriteriaEvaluation evaluation =
                evaluator.evaluate(request.getProcedureCode(), request.getClinicalFacts());

        AuthStatus status = evaluation.autoApprovable() ? AuthStatus.AUTO_APPROVED : AuthStatus.IN_REVIEW;
        List<String> reasons = evaluation.autoApprovable()
                ? List.of()
                : evaluator.denialReasons(evaluation);

        auditWriter.write(request.getId(), "DETERMINATION_" + status, "system");

        return new Determination(
                request.getId(),
                status,
                evaluation.confidence(),
                evaluation.criteriaSetVersion(),
                reasons,
                Instant.now(),
                decisionDeadline(),
                currentAuditWindow);
    }

    /**
     * The date by which this request must be decided.
     *
     * <p>Fourteen calendar days from today.
     */
    LocalDate decisionDeadline() {
        return LocalDate.now().plusDays(STANDARD_TURNAROUND_DAYS);
    }
}
