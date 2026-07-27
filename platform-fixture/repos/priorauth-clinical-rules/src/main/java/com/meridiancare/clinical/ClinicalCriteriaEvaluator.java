package com.meridiancare.clinical;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Scores a request against a criteria set.
 *
 * <p>Pure functions over plain data: no I/O, no PHI in the signature, no audit
 * call. Unit-testable in isolation, which is why it is easy to mistake for
 * service-internal logic.
 */
public class ClinicalCriteriaEvaluator {

    private final CriteriaRepository repository;

    public ClinicalCriteriaEvaluator(CriteriaRepository repository) {
        this.repository = repository;
    }

    /**
     * @param procedureCode the requested procedure
     * @param facts         clinical facts asserted by the submitting provider
     */
    public CriteriaEvaluation evaluate(String procedureCode, Map<String, Boolean> facts) {
        ClinicalCriteria criteria = repository.forProcedure(procedureCode);
        if (criteria == null) {
            return new CriteriaEvaluation(procedureCode, "none", 0.0, false,
                    List.of("NO_CRITERIA"), "NOT_MET");
        }

        double weightTotal = 0.0;
        double weightMet = 0.0;
        boolean allRequiredMet = true;
        List<String> unmet = new ArrayList<>();

        for (ClinicalCriteria.Rule rule : criteria.rules()) {
            weightTotal += rule.weight();
            boolean met = Boolean.TRUE.equals(facts.get(rule.code()));
            if (met) {
                weightMet += rule.weight();
            } else {
                unmet.add(rule.code());
                if (rule.required()) {
                    allRequiredMet = false;
                }
            }
        }

        double confidence = weightTotal == 0.0 ? 0.0 : weightMet / weightTotal;
        String reasonCode = allRequiredMet && confidence >= Thresholds.AUTO_APPROVE_THRESHOLD
                ? "MET"
                : "NOT_MET";

        return new CriteriaEvaluation(procedureCode, criteria.criteriaSetVersion(),
                confidence, allRequiredMet, List.copyOf(unmet), reasonCode);
    }

    /**
     * Denial reasons shown to the provider and to the nurse queue.
     *
     * <p>Consumers on 2.3 get the short codes; from 2.8 the text is expanded so a
     * provider can act on it without calling us.
     */
    public List<String> denialReasons(CriteriaEvaluation evaluation) {
        List<String> out = new ArrayList<>();
        for (String code : evaluation.unmetRuleCodes()) {
            out.add(ReasonText.expand(code));
        }
        return out;
    }
}
