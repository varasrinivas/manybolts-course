package com.meridiancare.clinical;

import java.util.List;
import java.util.Map;

/** Source of criteria sets. In production this is backed by the criteria store. */
public class CriteriaRepository {

    private final Map<String, ClinicalCriteria> byProcedure;

    public CriteriaRepository() {
        this(defaults());
    }

    public CriteriaRepository(Map<String, ClinicalCriteria> byProcedure) {
        this.byProcedure = Map.copyOf(byProcedure);
    }

    public ClinicalCriteria forProcedure(String procedureCode) {
        return byProcedure.get(procedureCode);
    }

    private static Map<String, ClinicalCriteria> defaults() {
        return Map.of(
                "27447", new ClinicalCriteria("27447", "2026.1", List.of(
                        new ClinicalCriteria.Rule("CONSERVATIVE_THERAPY", "Documented conservative therapy", 0.36, true),
                        new ClinicalCriteria.Rule("IMAGING_PRIOR", "Imaging within 90 days", 0.32, true),
                        new ClinicalCriteria.Rule("AGE_BAND", "Age band indicated", 0.22, false),
                        // Small weight, still required: the provider must attest that
                        // the documentation on file is current. Added 2025-08 after the
                        // documentation audit.
                        new ClinicalCriteria.Rule("PROVIDER_ATTESTATION", "Provider attestation of current documentation", 0.10, true))),
                "29881", new ClinicalCriteria("29881", "2026.1", List.of(
                        new ClinicalCriteria.Rule("CONSERVATIVE_THERAPY", "Documented conservative therapy", 0.5, true),
                        new ClinicalCriteria.Rule("SPECIALIST_REFERRAL", "Specialist referral on file", 0.5, false))),
                "70551", new ClinicalCriteria("70551", "2026.1", List.of(
                        new ClinicalCriteria.Rule("IMAGING_PRIOR", "Prior imaging reviewed", 0.6, true),
                        new ClinicalCriteria.Rule("SPECIALIST_REFERRAL", "Specialist referral on file", 0.4, true))));
    }
}
