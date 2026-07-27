package com.meridiancare.priorauth.domain;

/** The submitting provider. */
public record Provider(String npi, String name, String specialty, boolean inNetwork) {
}
