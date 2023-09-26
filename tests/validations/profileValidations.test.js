"use strict";

const { ProfileUpdateSchema } = require("../../validations");
const { expect } = require("chai");

describe("Profile Validations", () => {
  describe("Update Schema", () => {
    it("should validate a valid update schema object", async () => {
      // Arrange
      const validUpdateObject = {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        battleNet: "test#1234", // ^[A-Za-z0-9]+#[0-9]+$
      };

      // Act
      const result = ProfileUpdateSchema.validate(validUpdateObject);

      // Assert
      expect(result.error).to.be.undefined;
    });

    it("should not validate an invalid missing update Schema object", () => {
      // Arrange
      const invalidMissingObject = {};

      // Act
      const result = ProfileUpdateSchema.validate(invalidMissingObject);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("any.required");
      });
    });

    it("should not validate an invalid empty update Schema object", () => {
      // Arrange
      const validUpdateObject = {
        userId: "",
        battleNet: "",
      };

      // Act
      const result = ProfileUpdateSchema.validate(validUpdateObject);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.empty");
      });
    });

    it("should not validate an incorrect pattern update Schema object", () => {
      // Arrange
      const invalidBNet = {
        battle_net: "test1234",
      };

      // Act
      const result = ProfileUpdateSchema.validate(invalidBNet);

      // Assert
      expect(result.error).to.not.be.null;
    });
  });
});
