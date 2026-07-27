package com.meridiancare.clinical;

import java.util.List;

/** The outcome of evaluating one request against one criteria set. */
public record CriteriaEvaluation(
        String procedureCode,
        String criteriaSetVersion,
        double confidence,
        boolean allRequiredMet,
        List<String> unmetRuleCodes,
        String reasonCode) {

    public boolean autoApprovable() {
        return allRequiredMet && confidence >= Thresholds.AUTO_APPROVE_THRESHOLD;
    }
}
