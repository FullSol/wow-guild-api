"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const { ProfileService } = require("../../services");

describe("Profile Service", () => {
  let service;

  const profileObject = {
    id: 1,
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    battle_net: "user-battle-net",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("Read One", () => {
    it("should return profile of the provided user", async () => {
      // Arrange
      const mockRepo = { findAll: sinon.stub().resolves(profileObject) };
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      service = new ProfileService(mockRepo);

      // Act
      const result = await service.readOneByUser(userId);

      // Assert
      expect(mockRepo.findAll.called).to.be.true;
      expect(result).to.equal(profileObject);
    });

    it("should handle missing id request", async () => {
      // Arrange
      const nullId = null;
      const mockRepo = { findAll: sinon.stub().resolves(profileObject) };
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
        expect(mockRepo.findAll.called).to.be.false;
      }
    });

    it("should respond with ResourceNotFoundError", async () => {
      // Arrange
      const userId = 1;
      const mockRepo = { findAll: sinon.stub().resolves(null) };
      service = new ProfileService(mockRepo);

      try {
        // Act
        await service.readOneByUser(userId);

        // Assert
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findAll.called).of.be.true;
        expect(error.name).to.equal("ResourceNotFoundError");
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const userId = 1;
      const mockRepo = {
        findAll: sinon.stub().throws(new Error("Internal Server Error")),
      };
      service = new ProfileService(mockRepo);

      try {
        // Act
        await service.readOneByUser(userId);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findAll.called).true;
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
      }
    });
  });

  describe("Update", () => {
    const validProfile = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      battleNet: "user-battle-net",
    };
    it("should return message: resource updated for a valid request", async () => {
      // Arrange
      const mockRepo = { update: sinon.stub().resolves(profileObject) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new ProfileService(mockRepo);
      service.setUpdateSchema(updateSchema);

      // Act
      const result = await service.update(validProfile);

      // If no error is thrown, fail the test
      expect(updateSchema.validate.called).to.be.true;
      expect(mockRepo.update.called).to.be.true;
      expect(result).to.deep.equal(profileObject);
    });

    it("should respond with ResourceNotFoundError", async () => {
      // Arrange
      const validProfile = {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        battleNet: "user-battle-net",
      };
      const mockRepo = { update: sinon.stub().resolves({ 0: 0 }) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new ProfileService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        await service.update(validProfile);

        // Assert
        expect.fail("Expected ResourceNotFound error, but received no error.");
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
      service = new ProfileService(mockRepo);
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
      service = new ProfileService(mockRepo);
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
