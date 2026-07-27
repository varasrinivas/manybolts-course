package com.meridiancare.priorauth.domain;

import java.time.Instant;
import java.util.Map;

/** A request for prior authorisation. */
public final class AuthRequest {

    private final String id;
    private final Member member;
    private final Provider provider;
    private final String procedureCode;
    private final Map<String, Boolean> clinicalFacts;
    private final Instant receivedAt;

    public AuthRequest(String id, Member member, Provider provider, String procedureCode,
                       Map<String, Boolean> clinicalFacts, Instant receivedAt) {
        this.id = id;
        this.member = member;
        this.provider = provider;
        this.procedureCode = procedureCode;
        this.clinicalFacts = Map.copyOf(clinicalFacts);
        this.receivedAt = receivedAt;
    }

    public String getId() {
        return id;
    }

    public Member getMember() {
        return member;
    }

    public Provider getProvider() {
        return provider;
    }

    public String getProcedureCode() {
        return procedureCode;
    }

    public Map<String, Boolean> getClinicalFacts() {
        return clinicalFacts;
    }

    public Instant getReceivedAt() {
        return receivedAt;
    }
}
