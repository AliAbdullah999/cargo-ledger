import type { Weight } from '../types';

export function assertSameWeightUnit(a: Weight, b: Weight) {
  if (a.unit !== b.unit) {
    throw new Error('Weight units must match');
  }
}
