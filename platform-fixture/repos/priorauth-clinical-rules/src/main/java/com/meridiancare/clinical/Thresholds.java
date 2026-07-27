package com.meridiancare.clinical;

/** Platform-wide decision thresholds. */
public final class Thresholds {

    /**
     * Confidence at or above which a determination is issued without a nurse
     * looking at it. Changing this changes clinical risk, not just throughput.
     */
    public static final double AUTO_APPROVE_THRESHOLD = 0.85;

    private Thresholds() {
    }
}
