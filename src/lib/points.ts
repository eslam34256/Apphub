export const POINTS = { REVIEW: 5, REPORT_DEAL: 15, NEWSLETTER: 20, AI_RECOMMENDATION: 10, COMMENT: 5, COMPARE: 8 };
export type PointAction = keyof typeof POINTS;
export function pointsFor(action: PointAction): number { return POINTS[action]; }
