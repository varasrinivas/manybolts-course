package com.meridiancare.priorauth.gate;

import java.util.Optional;

/** Gate mob convention: failures are values, not exceptions. */
public final class Result<T> {

    private final T value;
    private final String failureCode;

    private Result(T value, String failureCode) {
        this.value = value;
        this.failureCode = failureCode;
    }

    public static <T> Result<T> ok(T value) {
        return new Result<>(value, null);
    }

    public static <T> Result<T> failure(String code) {
        return new Result<>(null, code);
    }

    public boolean isFailure() {
        return failureCode != null;
    }

    public Optional<String> failureCode() {
        return Optional.ofNullable(failureCode);
    }

    /** Returns the value, or null when this is a failure. */
    public T orNull() {
        return value;
    }
}
