package com.meridiancare.clinical;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ClinicalCriteriaEvaluatorTest {

    private final ClinicalCriteriaEvaluator evaluator =
            new ClinicalCriteriaEvaluator(new CriteriaRepository());

    @Test
    void allRulesMetScoresOne() {
        CriteriaEvaluation e = evaluator.evaluate("27447", Map.of(
                "CONSERVATIVE_THERAPY", true, "IMAGING_PRIOR", true, "AGE_BAND", true,
                "PROVIDER_ATTESTATION", true));
        assertEquals(1.0, e.confidence(), 0.0001);
        assertTrue(e.autoApprovable());
    }

    @Test
    void missingRequiredRuleBlocksAutoApproval() {
        CriteriaEvaluation e = evaluator.evaluate("27447", Map.of(
                "CONSERVATIVE_THERAPY", true, "IMAGING_PRIOR", false, "AGE_BAND", true,
                "PROVIDER_ATTESTATION", true));
        assertFalse(e.allRequiredMet());
        assertFalse(e.autoApprovable());
    }

    /**
     * A missing attestation costs a tenth of the score and blocks auto-approval,
     * because it is required. Confidence alone is not the decision.
     */
    @Test
    void missingAttestationBlocksAutoApprovalDespiteHighConfidence() {
        CriteriaEvaluation e = evaluator.evaluate("27447", Map.of(
                "CONSERVATIVE_THERAPY", true, "IMAGING_PRIOR", true, "AGE_BAND", true,
                "PROVIDER_ATTESTATION", false));
        assertEquals(0.90, e.confidence(), 0.0001);
        assertFalse(e.allRequiredMet());
        assertFalse(e.autoApprovable());
    }

    @Test
    void unknownProcedureIsNotAutoApprovable() {
        CriteriaEvaluation e = evaluator.evaluate("99999", Map.of());
        assertFalse(e.autoApprovable());
        assertEquals("none", e.criteriaSetVersion());
    }
}
