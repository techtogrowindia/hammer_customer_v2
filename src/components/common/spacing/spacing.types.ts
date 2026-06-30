import type { Spacing } from './spacing';

export type SpacingType = (typeof Spacing)[keyof typeof Spacing];
