package com.meridiancare.priorauth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a handler that crosses a protected-health-information boundary.
 *
 * <p>Root steering, INV-3: every handler whose parameters or return type carry a
 * member identifier is annotated, and the annotation drives the audit interceptor.
 * A handler that touches member data without it produces no audit record.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface PhiBoundary {
    String reason() default "";
}
