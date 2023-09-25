"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const { ProfileService } = require("../../services");

describe("Profile Service", () => {
  let service;

  const profileObject = {
    id: 1,
    user_id: "some-uuid-string",
    battle_net: "user-battle-net",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("Read One", () => {
    it("should return profile of the provided user", async () => {
      // Arrange
      const mockRepo = { findByUserPk: sinon.stub().resolves(profileObject) };
      const userId = "some-uuid-string";
      service = new ProfileService(mockRepo);

      // Act
      const result = await service.readOneByUser(userId);

      // Assert
      expect(mockRepo.findByUserPk.called).to.be.true;
      expect(result).to.equal(profileObject);
    });

    it("should handle missing id request", async () => {
      // Arrange
      const nullId = null;
      const mockRepo = { findByUserPk: sinon.stub().resolves(profileObject) };
      service = new ProfileService(mockRepo);

      try {
        // Act
        await service.readOneByUser(nullId);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal("Valid User ID must be provided.");
        expect(mockRepo.findByUserPk.called).to.be.false;
      }
    });

    it("should respond with ResourceNotFoundError", async () => {
      // Arrange
      const userId = 1;
      const mockRepo = { findByUserPk: sinon.stub().resolves(null) };
      service = new ProfileService(mockRepo);

      try {
        // Act
        await service.readOneByUser(userId);

        // Assert
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findByUserPk.called).of.be.true;
        expect(error.name).to.equal("ResourceNotFoundError");
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const userId = 1;
      const mockRepo = {
        findByUserPk: sinon.stub().throws(new Error("Internal Server Error")),
      };
      service = new ProfileService(mockRepo);

      try {
        // Act
        await service.readOneByUser;

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findByUserPk.called).true;
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
      }
    });
  });

  describe("Update", () => {
    const validProfile = { field1: "data1" };
    it("should return message: resource updated for a valid request", async () => {
      // Arrange

      const validUserId = "some-user-uuid";
      const mockRepo = { update: sinon.stub().resolves(validProfile) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      // Act
      const result = await service.update(validUserId);

      // If no error is thrown, fail the test
      expect(updateSchema.validate.called).to.be.true;
      expect(mockRepo.update.called).to.be.true;
      expect(result).to.deep.equal(validProfile);
    });

    it("should handle missing id request", async () => {
      // Arrange
      const validProfile = { field1: "data1" };
      const invalidId = null;
      const mockRepo = { update: sinon.stub().resolves(validProfile) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        await service.update(invalidId);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal("Resource ID must be numerical");
        expect(updateSchema.validate.called).to.be.false;
        expect(mockRepo.update.called).to.be.false;
      }
    });

    it("should respond with ResourceNotFoundError", async () => {
      // Arrange
      const id = 1;
      const validData = { field1: "data1" };
      const mockRepo = { update: sinon.stub().resolves({ 0: 0 }) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        const result = await service.update(id, validData);

        // Assert
        expect(result).to.deep.equal(null);
      } catch (error) {
        // Assert
        expect(mockRepo.update.called).to.be.true;
        expect(error.name).to.equal("ResourceNotFoundError");
      }
    });

    it("should return message: invalid request", async () => {
      // Arrange
      const id = 1;
      const mockRepo = { update: sinon.stub().resolves(1) };
      const invalidJsonObject = {}; // bad object

      const validationError = new Error("Validation Error"); // Joi stub setup
      validationError.details = [
        {
          message: '"username" is required',
          path: ["username"],
          type: "any.required",
          context: {
            key: "username",
          },
        },
      ];

      const updateSchema = { validate: sinon.stub().throws(validationError) };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        await service.update(id, invalidJsonObject);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(updateSchema.validate.called).to.be.true;
        expect(error).to.equal(validationError);
        expect(error.details).to.deep.equal(validationError.details);
        expect(mockRepo.update.called).to.be.false;
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const validProfile = { field1: "data1" };
      const id = 1; // valid id
      const mockRepo = {
        update: sinon.stub().throws(new Error("Internal Server Error")),
      };

      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        await service.update(id, validProfile);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(updateSchema.validate.called).to.be.true;
        expect(mockRepo.update.called).to.be.true;
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
      }
    });
  });
});
