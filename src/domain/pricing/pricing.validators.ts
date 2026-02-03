import type { Weight } from '../types';
import { DomainValidationError } from '../domainErrors';
import type { InputRecordFormValues } from '../../features/inputRecord/inputRecord.types';

export function assertSameWeightUnit(a: Weight, b: Weight, causedBy: keyof InputRecordFormValues) {
  if (a.unit !== b.unit) {
    throw new DomainValidationError('Weight units must match', causedBy);
  }
}

export function assertFullExceedsEmpty(full: Weight, empty: Weight) {
  if (empty.value > full.value) {
    throw new DomainValidationError('Empty weight cannot exceed full weight', 'emptyWeight');
  }
}
