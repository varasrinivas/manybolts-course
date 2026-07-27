package com.meridiancare.priorauth.appeals;

/** Appeals mob convention: failures are domain exceptions. */
public class AppealException extends RuntimeException {

    private final String reasonCode;

    public AppealException(String reasonCode, String message) {
        super(message);
        this.reasonCode = reasonCode;
    }

    public String getReasonCode() {
        return reasonCode;
    }
}
