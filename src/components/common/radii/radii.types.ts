import type { Radii } from './radii';

export type RadiiType = (typeof Radii)[keyof typeof Radii];
