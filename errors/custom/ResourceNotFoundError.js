"use strict";
class ResourceNoFoundError extends Error {
  constructor(arg1) {
    super(arg1);
    this.name = "ResourceNotFoundError";
  }
}
exports.ResourceNoFoundError = ResourceNoFoundError;
