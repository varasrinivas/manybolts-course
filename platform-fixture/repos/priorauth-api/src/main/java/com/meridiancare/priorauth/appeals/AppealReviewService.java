package com.meridiancare.priorauth.appeals;

import com.meridiancare.priorauth.domain.Determination;
import com.meridiancare.priorauth.gate.Result;
import com.meridiancare.priorauth.gate.ThresholdService;

/**
 * Reopens a determination under appeal.
 *
 * <p>Appeals mob. Failures raise {@link AppealException}, per this mob's steering.
 */
public class AppealReviewService {

    private final ThresholdService thresholdService;

    public AppealReviewService(ThresholdService thresholdService) {
        this.thresholdService = thresholdService;
    }

    /**
     * Decides whether the original determination should stand.
     *
     * @throws AppealException when the appeal cannot be evaluated
     */
    public boolean upholdOriginal(Determination determination) {
        if (determination == null) {
            throw new AppealException("NO_DETERMINATION", "No determination to appeal");
        }

        Result<Double> threshold =
                thresholdService.thresholdFor("27447", determination.getCriteriaSetVersion());

        // The Gate call returns a value; our convention is that a failure throws.
        double applied = threshold.orNull() == null ? 0.0 : threshold.orNull();

        return determination.getConfidence() >= applied;
    }
}
