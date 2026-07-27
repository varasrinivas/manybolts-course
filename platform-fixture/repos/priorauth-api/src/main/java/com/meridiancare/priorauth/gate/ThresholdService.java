package com.meridiancare.priorauth.gate;

import com.meridiancare.clinical.Thresholds;

/**
 * Criteria-specific thresholds.
 *
 * <p>Gate mob. Failures are returned as {@link Result}, per this mob's steering.
 */
public class ThresholdService {

    public Result<Double> thresholdFor(String procedureCode, String criteriaSetVersion) {
        if (procedureCode == null || criteriaSetVersion == null) {
            return Result.failure("MISSING_INPUT");
        }
        if (!criteriaSetVersion.startsWith("2026")) {
            return Result.failure("CRITERIA_SET_UNSUPPORTED");
        }
        return Result.ok(Thresholds.AUTO_APPROVE_THRESHOLD);
    }
}
