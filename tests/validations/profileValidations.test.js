"use strict";

const { ProfileCreateSchema } = require("../../validations/");
const { expect } = require("chai");

describe("Profile Validations", () => {
  describe("Update Schema", () => {
    it("should validate a valid update schema object", async () => {
      // Arrange
      const validUpdateObject = {
        battle_net: "test#1234", // ^[A-Za-z0-9]+#[0-9]+$
      };

      // Act
      const result = ProfileCreateSchema.validate(validUpdateObject);

      // Assert
      expect(result.error).to.be.undefined;
    });

    it("should not validate an invalid empty update Schema object", () => {
      // Arrange
      const validUpdateObject = {
        battle_net: "",
      };

      // Act
      const result = ProfileCreateSchema.validate(validUpdateObject);

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
      const result = ProfileCreateSchema.validate(invalidBNet);

      // Assert
      expect(result.error).to.not.be.null;
    });
  });
});
