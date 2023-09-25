"use strict";
class ResourceNotFoundError extends Error {
  constructor(arg1) {
    super(arg1);
    this.name = "ResourceNotFoundError";
  }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
