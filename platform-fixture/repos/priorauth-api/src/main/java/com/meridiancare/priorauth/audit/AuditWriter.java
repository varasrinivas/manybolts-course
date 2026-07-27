package com.meridiancare.priorauth.audit;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/** In-memory audit sink. The real one writes to the append-only store. */
public class AuditWriter {

    private final List<AuditRecord> records = new ArrayList<>();

    public void write(String requestId, String action, String actor) {
        records.add(new AuditRecord(requestId, action, actor, Instant.now()));
    }

    public List<AuditRecord> records() {
        return List.copyOf(records);
    }

    public boolean hasRecordFor(String requestId) {
        return records.stream().anyMatch(r -> r.requestId().equals(requestId));
    }
}
