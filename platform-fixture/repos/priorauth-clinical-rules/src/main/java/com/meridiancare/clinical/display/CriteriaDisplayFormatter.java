package com.meridiancare.clinical.display;

import com.meridiancare.clinical.CriteriaEvaluation;
import com.meridiancare.web.tokens.DisplayTokens;

import java.util.List;

/**
 * Formats an evaluation for display.
 *
 * <p>Added so the nurse queue and the provider portal show the same wording
 * without each re-implementing it. Reuses the portal's own tokens rather than
 * duplicating the strings.
 */
public final class CriteriaDisplayFormatter {

    private CriteriaDisplayFormatter() {
    }

    public static String headline(CriteriaEvaluation evaluation) {
        return DisplayTokens.reasonLabel(evaluation.reasonCode());
    }

    public static String withReasons(CriteriaEvaluation evaluation, List<String> reasons) {
        String head = headline(evaluation);
        if (reasons.isEmpty()) {
            return head;
        }
        return head + DisplayTokens.SEPARATOR + String.join("; ", reasons);
    }
}
