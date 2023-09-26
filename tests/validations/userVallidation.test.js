"use strict";

const { invalid } = require("joi");
const {
  createSchema,
  updateSchema,
} = require("../../validations/userValidations");
const chai = require("chai");
const expect = chai.expect;

describe("User Validations", () => {
  describe("create schema", () => {
    it("should validate a valid update Schema object", () => {
      // Arrange
      const validJsonObject = {
        username: "JamesBond99",
        password: "password",
        repeat_password: "password",
        email: "jb@gmail.com",
        about: "The real secret agent",
      };

      // Act
      const result = createSchema.validate(validJsonObject);

      // Assert
      expect(result.error).to.be.undefined;
    });

    //TODO: Test the pattern

    it("should not validate for mismatched password and repeat_password", () => {
      // Arrange
      const invalidRepeatPassword = {
        username: "JamesBond99",
        password: "password",
        repeat_password: "password-mismatch",
        email: "jb@gmail.com",
        about: "The real secret agent",
      };

      // Act
      const result = createSchema.validate(invalidRepeatPassword);

      // Assert
      expect(result.error).to.exist;
      expect(result.error.details.length).to.equal(1);
      expect(result.error.details[0].type).to.equal("any.only");
    });

    it("should not validate password less than 3 characters", () => {
      // Arrange
      const invalidPasswordObject = {
        username: "test1",
        password: "12",
        repeat_password: "12",
        email: "test1@gmail.com",
        about: "It's me, Mario",
      };
      const message = "Password must be at least 8 characters long";

      // Act
      const result = createSchema.validate(invalidPasswordObject);

      // Assert
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.min");
      });
    });

    it("should not validate password more than 30 characters", async () => {
      // Arrange
      const invalidPasswordObject = {
        username: "JamesBond99",
        password: "1234567890123456789012345678901",
        repeat_password: "1234567890123456789012345678901",
        email: "jb@gmail.com",
        about: "The real secret agent",
      };

      // Act
      const result = createSchema.validate(invalidPasswordObject);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.be.oneOf(["string.max", "any.only"]);
      });
    });

    it("should not validate an invalid empty create Schema object", () => {
      // Arrange
      const invalidData = {
        username: "",
        password: "",
        repeat_password: "",
        email: "",
        about: "",
      };

      // Act
      const result = createSchema.validate(invalidData);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.empty");
      });
    });

    it("should not validate an invalid type create Schema object", () => {
      // Arrange
      const invalidData = {
        username: true,
        password: true,
        repeat_password: true,
        email: true,
        about: true,
      };

      // Act
      const result = createSchema.validate(invalidData);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.base");
      });
    });

    it("should not validate an invalid required create Schema object", () => {
      // Arrange
      const invalidData = {};

      // Act
      const result = createSchema.validate(invalidData);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("any.required");
      });
    });

    it("should not validate improper email format", async () => {
      // Arrange
      const invalidEmail = {
        username: "JamesBond99",
        password: "password",
        repeat_password: "password",
        email: "not-an-email",
        about: "The real secret agent",
      };

      // Act
      const result = createSchema.validate(invalidEmail);

      // Assert
      expect(result.error).of.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.email");
      });
    });
  });

  describe("update schema", () => {
    it("should validate a valid update update object", () => {
      // Arrange
      const validJsonObject = {
        username: "JamesBond99",
        password: "password",
        email: "jb@gmail.com",
        about: "The real secret agent",
      };

      // Act
      const result = updateSchema.validate(validJsonObject);

      // Assert
      expect(result.error).to.be.undefined;
    });

    it("should validate for password change", () => {
      // Arrange
      const validPasswordChange = {
        new_password: "password2",
        repeat_password: "password2",
      };

      // Act
      const result = updateSchema.validate(validPasswordChange);

      // Assert
      expect(result.error).to.be.undefined;
    });

    it("should not validate for mismatched new_password and repeat_password", () => {
      // Arrange
      const invalidRepeatPassword = {
        new_password: "password",
        repeat_password: "password-mismatch",
      };

      // Act
      const result = updateSchema.validate(invalidRepeatPassword);

      // Assert
      expect(result.error).to.exist;
      expect(result.error.details.length).to.equal(1);
      expect(result.error.details[0].type).to.equal("any.only");
    });

    it("should not validate password less than 3 characters", async () => {
      // Arrange
      const invalidPasswordObject = {
        new_password: "12",
        repeat_password: "12",
      };

      // Act
      const result = updateSchema.validate(invalidPasswordObject);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.be.oneOf(["string.min", "any.only"]);
      });
    });

    it("should not validate password more than 30 characters", async () => {
      // Arrange
      const invalidPasswordObject = {
        new_password: "1234567890123456789012345678901",
        repeat_password: "1234567890123456789012345678901",
      };

      // Act
      const result = updateSchema.validate(invalidPasswordObject);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        // expect(detail.type).to.be.oneOf(["string.max", "any.only"]);
        expect(detail.type).to.equal("string.max");
      });
    });

    it("should require repeat_password when new_password is present", () => {
      //Arrange
      const invalidPasswordChange = {
        new_password: "password2",
      };

      const result = updateSchema.validate(invalidPasswordChange);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.be.equal("any.required");
      });
    });

    it("should not validate an invalid empty property value update Schema object", () => {
      //  Arrange
      const invalidData = {
        username: "",
        password: "",
        repeat_password: "",
        email: "",
        about: "",
      };

      // Act
      const result = updateSchema.validate(invalidData);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.be.oneOf(["string.empty", "any.only"]);
      });
    });

    it("should not validate an invalid type update Schema object", () => {
      // Arrange
      const invalidData = {
        username: true,
        password: true,
        repeat_password: true,
        email: true,
        about: true,
      };

      // Act
      const result = updateSchema.validate(invalidData);

      // Assert
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.be.oneOf(["string.base", "any.only"]);
      });
    });

    it("should not validate improper email format", async () => {
      // Arrange
      const invalidEmail = {
        email: "not-an-email",
      };

      // Act
      const result = updateSchema.validate(invalidEmail);

      // Assert
      expect(result.error).of.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.email");
      });
    });
  });
});
