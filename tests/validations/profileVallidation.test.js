const {
  createSchema,
  updateSchema,
} = require("../../validations/profileValidations");
const chai = require("chai");
const expect = chai.expect;

describe("Profile Validations", () => {
  describe("create schema", () => {
    it("should validate a valid update Schema object", () => {
      const validJsonObject = {
        username: "JamesBond99",
        password: "password",
        repeat_password: "password",
        email: "jb@gmail.com",
        battleTag: "jb]BTag#1234",
        discord: "double07",
        twitch: "double07T",
        x: "double07X",
        youtube: "double07Vids",
        wowhead: "double07WH",
        primary_language: "English",
        about: "The real secret agent",
      };
      const result = updateSchema.validate(validJsonObject);
      expect(result.error).to.be.undefined;
    });

    it("should not validate an invalid empty create Schema object", () => {
      const invalidData = {
        username: "",
        password: "",
        repeat_password: "",
        email: "",
        battleTag: "",
        discord: "",
        twitch: "",
        x: "",
        youtube: "",
        wowhead: "",
        primary_language: "",
        about: "",
      };

      const result = updateSchema.validate(invalidData);

      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.empty");
      });
    });

    it("should not validate an invalid type create Schema object", () => {
      const invalidData = {
        username: true,
        password: true,
        repeat_password: true,
        email: true,
        battleTag: true,
        discord: true,
        twitch: true,
        x: true,
        youtube: true,
        wowhead: true,
        primary_language: true,
        about: true,
      };

      const result = createSchema.validate(invalidData);

      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.base");
      });
    });

    it("should not validate an invalid required create Schema object", () => {
      const invalidData = {};

      const result = createSchema.validate(invalidData);
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("any.required");
      });
    });
  });

  describe("update schema", () => {
    it("should validate a valid update update object", () => {
      const validJsonObject = {
        username: "JamesBond99",
        password: "password",
        repeat_password: "password",
        email: "jb@gmail.com",
        battleTag: "jb]BTag#1234",
        discord: "double07",
        twitch: "double07T",
        x: "double07X",
        youtube: "double07Vids",
        wowhead: "double07WH",
        primary_language: "English",
        about: "The real secret agent",
      };
      const result = updateSchema.validate(validJsonObject);
      expect(result.error).to.be.undefined;
    });

    it("should not validate an invalid empty update Schema object", () => {
      const invalidData = {
        username: "",
        password: "",
        repeat_password: "",
        email: "",
        battleTag: "",
        discord: "",
        twitch: "",
        x: "",
        youtube: "",
        wowhead: "",
        primary_language: "",
        about: "",
      };

      const result = updateSchema.validate(invalidData);

      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.empty");
      });
    });

    it("should not validate an invalid type update Schema object", () => {
      const invalidData = {
        username: true,
        password: true,
        repeat_password: true,
        email: true,
        battleTag: true,
        discord: true,
        twitch: true,
        x: true,
        youtube: true,
        wowhead: true,
        primary_language: true,
        about: true,
      };

      const result = createSchema.validate(invalidData);

      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("string.base");
      });
    });

    it("should not validate an invalid required update Schema object", () => {
      const invalidData = {};

      const result = createSchema.validate(invalidData);
      expect(result.error).to.exist;
      result.error.details.forEach((detail) => {
        expect(detail.type).to.equal("any.required");
      });
    });
  });
});
