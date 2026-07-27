package com.meridiancare.clinical;

import java.util.List;
import java.util.Objects;

/** A named criteria set for one procedure code. */
public final class ClinicalCriteria {

    private final String procedureCode;
    private final String criteriaSetVersion;
    private final List<Rule> rules;

    public ClinicalCriteria(String procedureCode, String criteriaSetVersion, List<Rule> rules) {
        this.procedureCode = Objects.requireNonNull(procedureCode);
        this.criteriaSetVersion = Objects.requireNonNull(criteriaSetVersion);
        this.rules = List.copyOf(rules);
    }

    public String procedureCode() {
        return procedureCode;
    }

    public String criteriaSetVersion() {
        return criteriaSetVersion;
    }

    public List<Rule> rules() {
        return rules;
    }

    /** One clinical rule: a fact that must hold, and how much it contributes. */
    public record Rule(String code, String description, double weight, boolean required) {
    }
}
