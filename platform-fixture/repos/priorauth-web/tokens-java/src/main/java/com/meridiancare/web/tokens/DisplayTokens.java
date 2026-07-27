package com.meridiancare.web.tokens;

/**
 * Display tokens exported from the portal's design system so JVM consumers can
 * render the same labels. Owned by the Portal mob.
 */
public final class DisplayTokens {

    public static final String LABEL_APPROVED = "Approved";
    public static final String LABEL_DENIED = "Not approved";
    public static final String LABEL_PENDING = "In clinical review";

    public static final String SEPARATOR = " \u2014 ";

    private DisplayTokens() {
    }

    public static String reasonLabel(String code) {
        if (code == null) {
            return LABEL_PENDING;
        }
        return switch (code) {
            case "MET" -> LABEL_APPROVED;
            case "NOT_MET" -> LABEL_DENIED;
            default -> LABEL_PENDING;
        };
    }
}
