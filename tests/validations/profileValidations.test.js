"use strict";

const { ProfileUpdateSchema } = require("../../validations");
const { expect } = require("chai");

describe("Profile Validations", () => {
  describe("Update Schema", () => {
    it("should validate a valid update schema object", async () => {
      // Arrange
      const validUpdateObject = {
        battleNet: "test#1234",
        about: "this is a test user",
      };

      // Act
      const result = ProfileUpdateSchema.validate(validUpdateObject);

      // Assert
      expect(result.error).to.be.undefined;
    });

    it("should not validate an invalid empty update Schema object", () => {
      // Arrange
      const validUpdateObject = {
        battleNet: "",
        about: "",
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
        battleNet: "test1234",
      };

      // Act
      const result = ProfileUpdateSchema.validate(invalidBNet);

      // Assert
      expect(result.error).to.not.be.null;
    });
  });
});
