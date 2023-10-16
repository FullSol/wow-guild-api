"use strict";
class AuthenticationFailureError extends Error {
  constructor(arg1) {
    super(arg1);
    this.name = "AuthenticationFailureError";
  }
}
exports.AuthenticationFailureError = AuthenticationFailureError;
