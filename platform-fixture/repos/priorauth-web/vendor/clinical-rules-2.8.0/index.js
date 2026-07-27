// Clinical rules — JS mirror of the Java library, 2.8.0.
// 2.8 expands reason codes into provider-actionable sentences.
export const CRITERIA_SET_VERSION = '2026.1';

const EXPANDED = {
  CONSERVATIVE_THERAPY: 'Six weeks of documented conservative therapy is required before this procedure.',
  IMAGING_PRIOR: 'Recent imaging (within 90 days) supporting the diagnosis was not found.',
  SPECIALIST_REFERRAL: 'A specialist referral is required for this procedure.',
  AGE_BAND: "The member's age falls outside the indicated band for this procedure.",
  NO_CRITERIA: 'No criteria set is published for this procedure code.'
};

export function denialReasons(evaluation) {
  return (evaluation.unmetRuleCodes || []).map((code) => EXPANDED[code] || code);
}

export function autoApprovable(evaluation) {
  return evaluation.allRequiredMet && evaluation.confidence >= 0.85;
}
