"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const { UserService } = require("../../services");
const { valid } = require("joi");

describe("User Service", () => {
  let service;

  const jsonObjectArray = [
    {
      id: 1,
      field1: "data1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      field1: "data2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      field1: "data3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe("Create", () => {
    it("should return message: created resource for a valid request", async () => {
      // Arrange
      const validJsonObject = { username: "testUser", password: "password" };
      const mockRepo = { create: sinon.stub().resolves(1) };
      const createSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setCreateSchema(createSchema);

      // Act
      const result = await service.create(validJsonObject);

      // Assert
      expect(createSchema.validate.called).to.be.true;
      expect(mockRepo.create.called).to.be.true;
      expect(result).to.equal(1);
    });

    it("should return message: invalid request", async () => {
      // Arrange
      const mockRepo = { create: sinon.stub().resolves(1) };
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

      const createSchema = { validate: sinon.stub().throws(validationError) };
      service = new UserService(mockRepo);
      service.setCreateSchema(createSchema);

      try {
        // Act
        await service.create(invalidJsonObject);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(createSchema.validate.called).to.be.true;
        expect(error).to.equal(validationError);
        expect(error.details).to.deep.equal(validationError.details);
        expect(mockRepo.create.called).to.be.false;
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const mockRepo = {
        create: sinon.stub().throws(new Error("Internal Server Error")),
      };
      const validJsonObject = { username: "testUser", password: "password" };
      const createSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setCreateSchema(createSchema);

      try {
        // Act
        await service.create(validJsonObject);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(createSchema.validate.called).to.be.true;
        expect(mockRepo.create.called).to.be.true;
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
      }
    });
  });

  describe("read all", () => {
    it("should respond with an array of objects", async () => {
      // Arrange
      const mockRepo = { findAll: sinon.stub().resolves(jsonObjectArray) };
      service = new UserService(mockRepo);

      // Act
      const result = await service.readAll();

      // Assert
      expect(mockRepo.findAll.called).to.be.true;
      expect(result).to.deep.equal(jsonObjectArray);
    });

    it("should respond with an empty array", async () => {
      // Arrange
      const emptyArray = [];
      const mockRepo = { findAll: sinon.stub().resolves(emptyArray) };
      service = new UserService(mockRepo);

      // Act
      const result = await service.readAll();

      // Assert
      expect(mockRepo.findAll.called).to.be.true;
      expect(result).to.deep.equal(emptyArray);
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const mockRepo = {
        findAll: sinon.stub().throws(new Error("Internal Server Error")),
      };
      service = new UserService(mockRepo);

      try {
        // Act
        await service.readAll();

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findAll.called).to.be.true;
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
      }
    });
  });

  describe("read one", () => {
    it("should return resource with provided PK", async () => {
      // Arrange
      const jsonObject = {
        id: 1,
        validField: "validData",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockRepo = { findByPk: sinon.stub().resolves(jsonObject) };
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
      service = new UserService(mockRepo);

      // Act
      const result = await service.readOne(id);

      // Assert
      expect(mockRepo.findByPk.called).to.be.true;
      expect(result).to.equal(jsonObject);
    });

    it("should handle missing id request", async () => {
      // Arrange
      const nullId = null; // This should cause an error
      const mockRepo = { findByPk: sinon.stub().resolves(1) };
      service = new UserService(mockRepo);

      try {
        // Act
        await service.readOne(nullId);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceNotFoundError");
        expect(mockRepo.findByPk.called).to.be.false;
      }
    });

    it("should respond with ResourceNotFoundError", async () => {
      // Arrange
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
      const mockRepo = { findByPk: sinon.stub().resolves(null) };
      service = new UserService(mockRepo);

      try {
        // Act
        await service.readOne(id);

        // Assert
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findByPk.called).to.be.true;
        expect(error.name).to.equal("ResourceNotFoundError");
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
      const mockRepo = {
        findByPk: sinon.stub().throws(new Error("Internal Server Error")),
      };
      service = new UserService(mockRepo);

      try {
        // Act
        await service.readOne(id);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(mockRepo.findByPk.called).true;
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
      }
    });
  });

  describe("Update", () => {
    it("should return message: resource updated for a valid request", async () => {
      // Arrange
      const validJsonObject = { email: "data1" };
      const validId = "04072a64-ae75-4825-9025-420c9d4d8eaa";
      const mockRepo = { update: sinon.stub().resolves(validJsonObject) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      const updateData = { email: "data1", password: "password" };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      // Act
      const result = await service.update(validId, updateData);

      // If no error is thrown, fail the test
      expect(updateSchema.validate.called).to.be.true;
      expect(mockRepo.update.called).to.be.true;
      expect(result).to.deep.equal(validJsonObject);
    });

    it("should handle missing id request", async () => {
      // Arrange
      const validJsonObject = { field1: "data1" };
      const invalidId = null;
      const mockRepo = { update: sinon.stub().resolves(validJsonObject) };
      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        await service.update(invalidId, validJsonObject);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceNotFoundError");
        expect(updateSchema.validate.called).to.be.false;
        expect(mockRepo.update.called).to.be.false;
      }
    });

    it("should respond with ResourceNotFoundError", async () => {
      // Arrange
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
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
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
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
      const validJsonObject = { field1: "data1" };
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa"; // valid id
      const mockRepo = {
        update: sinon.stub().throws(new Error("Internal Server Error")),
      };

      const updateSchema = { validate: sinon.stub().returnsThis() };
      service = new UserService(mockRepo);
      service.setUpdateSchema(updateSchema);

      try {
        // Act
        await service.update(id, validJsonObject);

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

  describe("delete", () => {
    it("should delete resource with provided PK", async () => {
      // Arrange
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
      const mockRepo = { destroy: sinon.stub().resolves(1) };
      service = new UserService(mockRepo);

      // Act
      const result = await service.delete(id);

      // Assert
      expect(mockRepo.destroy.called).to.be.true;
      expect(result).to.equal(1);
    });

    it("should respond with 0 if nno records deleted", async () => {
      // Arrange
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa";
      const mockRepo = { destroy: sinon.stub().resolves(0) };
      service = new UserService(mockRepo);

      // Act
      const result = await service.delete(id);

      // Assert
      expect(mockRepo.destroy.called).to.be.true;
      expect(result).to.equal(0);
    });

    it("should handle missing id request", async () => {
      // Arrange
      const invalidId = null; // This should cause an error
      const mockRepo = { destroy: sinon.stub().resolves(1) };
      service = new UserService(mockRepo);

      try {
        // Act
        await service.delete(invalidId);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceNotFoundError");
        expect(mockRepo.destroy.called).to.be.false;
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      // Arrange
      const mockRepo = {
        destroy: sinon.stub().throws(new Error("Internal Server Error")),
      };
      const id = "04072a64-ae75-4825-9025-420c9d4d8eaa"; // valid id
      service = new UserService(mockRepo);

      try {
        // Act
        await service.delete(id);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
        expect(mockRepo.destroy.called).to.be.true;
      }
    });
  });
});
