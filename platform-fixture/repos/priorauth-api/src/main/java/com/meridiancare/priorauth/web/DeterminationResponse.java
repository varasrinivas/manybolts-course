package com.meridiancare.priorauth.web;

import com.meridiancare.priorauth.domain.Determination;

import java.util.List;

/** Public response payload. Cross-team contract: the portal renders this. */
public record DeterminationResponse(
        String requestId,
        String status,
        List<String> reasons,
        String decisionDeadline) {

    public static DeterminationResponse from(Determination d) {
        return new DeterminationResponse(
                d.getRequestId(),
                d.getStatus().name(),
                d.getReasons(),
                d.getDecisionDeadline().toString());
    }
}
