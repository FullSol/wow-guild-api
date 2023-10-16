"use strict";
class AggregateValidationError extends AggregateError {
  constructor(arg1, arg2) {
    super(arg1, arg2);
    this.name = "ValidationError";
  }
}
exports.AggregateValidationError = AggregateValidationError;
