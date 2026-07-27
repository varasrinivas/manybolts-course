package com.meridiancare.priorauth.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * The decision on an authorisation request.
 *
 * <p>Owned by priorauth-api. The only writer is {@code DeterminationService}.
 */
public final class Determination {

    private final String requestId;
    private final AuthStatus status;
    private final double confidence;
    private final String criteriaSetVersion;
    private final List<String> reasons;
    private final Instant decidedAt;
    private final LocalDate decisionDeadline;
    private final long auditWindow;

    public Determination(String requestId, AuthStatus status, double confidence,
                         String criteriaSetVersion, List<String> reasons,
                         Instant decidedAt, LocalDate decisionDeadline, long auditWindow) {
        this.requestId = requestId;
        this.status = status;
        this.confidence = confidence;
        this.criteriaSetVersion = criteriaSetVersion;
        this.reasons = List.copyOf(reasons);
        this.decidedAt = decidedAt;
        this.decisionDeadline = decisionDeadline;
        this.auditWindow = auditWindow;
    }

    public String getRequestId() {
        return requestId;
    }

    public AuthStatus getStatus() {
        return status;
    }

    public double getConfidence() {
        return confidence;
    }

    public String getCriteriaSetVersion() {
        return criteriaSetVersion;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public Instant getDecidedAt() {
        return decidedAt;
    }

    /** The audit batch window this determination's records belong to. */
    public long getAuditWindow() {
        return auditWindow;
    }

    /** Statutory turnaround: 14 calendar days from receipt. */
    public LocalDate getDecisionDeadline() {
        return decisionDeadline;
    }
}
