package com.meridiancare.priorauth.audit;

import java.time.Instant;

/**
 * Provenance for one landed unit of work — schema v1.
 *
 * <p>See evidence/PROVENANCE_SCHEMA.v1.json. Written by the pipeline at land time.
 */
public record ProvenanceRecord(
        String unitOfWork,
        String mob,
        String engine,
        String approver,
        String tier,
        Instant landedAt) {
}
