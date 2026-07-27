package com.meridiancare.priorauth.domain;

/**
 * Lifecycle of an authorisation request.
 *
 * <p>Owned by priorauth-api. Consumers read it; nothing outside this repository
 * adds values to it.
 */
public enum AuthStatus {
    RECEIVED,
    IN_REVIEW,
    AUTO_APPROVED,
    APPROVED,
    DENIED,
    WITHDRAWN
}
