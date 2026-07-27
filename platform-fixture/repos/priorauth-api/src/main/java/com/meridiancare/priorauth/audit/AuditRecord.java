package com.meridiancare.priorauth.audit;

import java.time.Instant;

/** One audit line. Written before the response is returned. */
public record AuditRecord(String requestId, String action, String actor, Instant at) {
}
