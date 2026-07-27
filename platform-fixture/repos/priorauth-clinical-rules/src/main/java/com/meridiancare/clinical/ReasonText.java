package com.meridiancare.clinical;

import java.util.Map;

/**
 * Denial reason text.
 *
 * <p>2.8 replaced the bare rule codes with provider-actionable sentences. A
 * consumer pinned below 2.8 still renders the old codes and cannot tell.
 */
final class ReasonText {

    private static final Map<String, String> EXPANDED = Map.of(
            "CONSERVATIVE_THERAPY", "Six weeks of documented conservative therapy is required before this procedure.",
            "IMAGING_PRIOR", "Recent imaging (within 90 days) supporting the diagnosis was not found.",
            "SPECIALIST_REFERRAL", "A specialist referral is required for this procedure.",
            "AGE_BAND", "The member's age falls outside the indicated band for this procedure.",
            "PROVIDER_ATTESTATION", "The provider has not attested that the documentation on file is current.",
            "NO_CRITERIA", "No criteria set is published for this procedure code.");

    private ReasonText() {
    }

    static String expand(String code) {
        return EXPANDED.getOrDefault(code, code);
    }
}
