const { AggregateValidationError } = require("./AggregateValidationError");
const {
  SequelizeUniqueConstraintError,
} = require("./SequelizeUniqueConstraintError");
const { ResourceNotFoundError } = require("./ResourceNotFoundError");
const { AuthenticationFailureError } = require("./AuthenticationFailureError");

module.exports = {
  AggregateValidationError,
  SequelizeUniqueConstraintError,
  ResourceNotFoundError,
  AuthenticationFailureError,
};
