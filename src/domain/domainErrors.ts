import type { InputRecordFormValues } from "../features/inputRecord/inputRecord.types";

export class DomainValidationError extends Error {
  readonly field: keyof InputRecordFormValues;

  constructor(message: string, field: keyof InputRecordFormValues) {
    super(message);
    this.field = field;

    Object.setPrototypeOf(this, DomainValidationError.prototype);
  }

}
