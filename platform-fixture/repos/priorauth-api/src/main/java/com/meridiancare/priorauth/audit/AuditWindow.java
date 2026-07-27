package com.meridiancare.priorauth.audit;

import java.time.Instant;

/**
 * Audit batching window.
 *
 * <p>Audit records ship to the append-only store in 100 ms batches. Everything
 * written in one window lands in the same batch file, which is how the evidence
 * export reassembles a decision and its audit lines.
 */
public final class AuditWindow {

    /** Matches the batch shipper's flush interval. */
    public static final long WINDOW_MILLIS = 100L;

    private AuditWindow() {
    }

    /** The window an instant belongs to. */
    public static long of(Instant instant) {
        return instant.toEpochMilli() / WINDOW_MILLIS;
    }

    /** The window we are in now. */
    public static long current() {
        return of(Instant.now());
    }
}
