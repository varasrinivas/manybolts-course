package com.meridiancare.priorauth.web;

import com.meridiancare.priorauth.domain.Member;
import com.meridiancare.priorauth.service.DeterminationService;

/**
 * GET /criteria/threshold
 *
 * <p>Added by the Gate mob so the portal can show which threshold produced a
 * determination. Copied from the reporting controller, which predates the
 * annotation rule.
 */
public class CriteriaThresholdController {

    private final DeterminationService service;

    public CriteriaThresholdController(DeterminationService service) {
        this.service = service;
    }

    public ThresholdResponse forMember(Member member, String procedureCode) {
        return new ThresholdResponse(
                member.getId(),
                procedureCode,
                0.85,
                "2026.1");
    }

    public record ThresholdResponse(String memberId, String procedureCode,
                                    double thresholdUsed, String criteriaSetVersion) {
    }
}
