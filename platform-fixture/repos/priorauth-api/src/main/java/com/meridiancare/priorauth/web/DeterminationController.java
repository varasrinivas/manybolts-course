package com.meridiancare.priorauth.web;

import com.meridiancare.priorauth.annotation.PhiBoundary;
import com.meridiancare.priorauth.domain.AuthRequest;
import com.meridiancare.priorauth.domain.Determination;
import com.meridiancare.priorauth.service.DeterminationService;

/** GET/POST /determinations */
public class DeterminationController {

    private final DeterminationService service;

    public DeterminationController(DeterminationService service) {
        this.service = service;
    }

    @PhiBoundary(reason = "request carries member identifiers")
    public DeterminationResponse submit(AuthRequest request) {
        Determination d = service.decide(request);
        return DeterminationResponse.from(d);
    }
}
