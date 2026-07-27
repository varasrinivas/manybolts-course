// Clinical rules — JS mirror of the Java library, 2.3.0.
// Reason text is the bare rule code.
export const CRITERIA_SET_VERSION = '2025.4';

export function denialReasons(evaluation) {
  return (evaluation.unmetRuleCodes || []).map((code) => code);
}

export function autoApprovable(evaluation) {
  return evaluation.allRequiredMet && evaluation.confidence >= 0.85;
}
