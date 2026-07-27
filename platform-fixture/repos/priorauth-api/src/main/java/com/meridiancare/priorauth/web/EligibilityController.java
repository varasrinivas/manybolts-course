package com.meridiancare.priorauth.web;

import com.meridiancare.priorauth.annotation.PhiBoundary;
import com.meridiancare.priorauth.domain.Member;
import com.meridiancare.priorauth.service.EligibilityService;

import java.time.LocalDate;

/** GET /eligibility */
public class EligibilityController {

    private final EligibilityService service = new EligibilityService();

    @PhiBoundary(reason = "member record")
    public String check(Member member, String procedureCode, LocalDate effectiveDate) {
        return service.determineEligibility(member, procedureCode, effectiveDate);
    }
}
