const { AggregateValidationError } = require("./AggregateValidationError");
const {
  SequelizeUniqueConstraintError,
} = require("./SequelizeUniqueConstraintError");

module.exports = { AggregateValidationError, SequelizeUniqueConstraintError };
