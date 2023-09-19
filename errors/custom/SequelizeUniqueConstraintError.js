"use strict";
class SequelizeUniqueConstraintError extends AggregateError {
  constructor(arg1, arg2) {
    super(arg1, arg2);
    this.name = "SequelizeUniqueConstraintError";
  }
}
exports.SequelizeUniqueConstraintError = SequelizeUniqueConstraintError;
