const { expect } = require("chai");
const sinon = require("sinon");
const Service = require("../../services/profileService");

describe("Profile Service", () => {
  let service;
  let mockRepo;

  const validJsonObject = {
    validField: "validData",
  };

  const jsonObject = {
    id: 1,
    validField: "validData",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const jsonObjectArray = [
    {
      id: 1,
      validField: "validData1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      validField: "validData2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      validField: "validData3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const setupService = () => {
    createSchema = { validate: sinon.stub() };

    updateSchema = { validate: sinon.stub() };

    mockRepo = {
      create: sinon.stub(),
      findAll: sinon.stub(),
      findByPk: sinon.stub(),
      update: sinon.stub(),
      destroy: sinon.stub(),
    };

    service = new Service(mockRepo, createSchema, updateSchema);
  };

  beforeEach(() => {
    setupService();
  });

  describe("Create", () => {
    it("should return success message and created resource for a valid request", async () => {
      // Arrange
      const mockRepo = {
        create: sinon.stub().resolves(1),
      };
      const createSchema = { validate: sinon.stub().returns(null) };
      const updateSchema = { validate: sinon.stub().returns(null) };

      const service = new Service(mockRepo, createSchema, updateSchema);

      // Act
      const result = await service.create(validJsonObject);

      // Assert
      expect(result).to.equal(1);
      expect(mockRepo.create.called).to.be.true;
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      try {
        // Arrange
        mockRepo.create.throws(new Error("Internal Server Error"));

        // Act
        await service.create(validJsonObject);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
        expect(mockRepo.create.called).to.be.true;
      }
    });
  });

  describe("read all", () => {
    it("should respond with an array of objects", async () => {
      // Arrange
      mockRepo.findAll.resolves(jsonObjectArray);

      // Act
      const result = await service.readAll();

      // Assert
      expect(result).to.deep.equal(jsonObjectArray);
      expect(mockRepo.findAll.called).to.be.true;
    });

    it("should return resource not found message", async () => {
      // Arrange
      mockRepo.findAll.resolves(null);

      try {
        // Act
        await service.readAll();

        // If no error is thrown, fail the test
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceError");
        expect(error.message).to.equal("The requested resource was not found");
        expect(mockRepo.findAll.called).to.be.true;
      }
    });

    it("should respond with a 500 Internal service error from the repo", async () => {
      try {
        // Arrange
        mockRepo.findAll.throws(new Error("Internal Server Error"));

        // Act
        await service.readAll();

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
        expect(mockRepo.findAll.called).to.be.true;
      }
    });
  });

  describe("read one", () => {
    it("should return resource with provided PK", async () => {
      // Arrange
      mockRepo.findByPk.resolves(jsonObject);
      const id = 1; // valid

      // Act
      const result = await service.readOne(id);

      // Assert
      expect(result).to.deep.equal(jsonObject);
      expect(mockRepo.findByPk.called).to.be.true;
    });

    it("should return resource not found message", async () => {
      // Arrange
      mockRepo.findByPk.resolves(null);

      try {
        // Act
        await service.readOne();

        // If no error is thrown, fail the test
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceError");
        expect(error.message).to.equal("The requested resource was not found");
        expect(mockRepo.findByPk.called).to.be.true;
      }
    });

    it("should handle missing id request", async () => {
      // Arrange
      const invalidId = null; // This should trigger a validation error

      try {
        // Act
        await service.readOne(invalidId);

        // If no error is thrown, fail the test
        expect.fail("Expected Error, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal("Internal Server Error");
        expect(mockRepo.findByPk.called).to.be.false;
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      try {
        // Arrange
        mockRepo.findByPk.throws(new Error("Internal Server Error"));
        const id = 1; // valid id

        // Act
        await service.readOne(id);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
        expect(mockRepo.findByPk.called).to.be.true;
      }
    });
  });

  describe("Update", () => {
    it("should update resource with provided PK", async () => {
      // Arrange
      mockRepo.update.resolves(jsonObject);
      const id = 1;

      // Act
      const result = await service.update(id, jsonInputObject);

      // Assert
      expect(result).to.deep.equal(jsonObject);
      expect(mockRepo.update.called).to.be.true;
    });

    it("should respond with resource not found error", async () => {
      // Arrange
      mockRepo.update.resolves({ 0: 0 });
      const id = 1;

      try {
        // Act
        await service.update(id, jsonInputObject);

        // If no error is thrown, fail the test
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceError");
        expect(error.message).to.equal("The requested resource was not found");
        expect(mockRepo.update.called).to.be.true;
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      try {
        // Arrange
        mockRepo.update.throws(new Error("Internal Server Error"));
        const id = 1; // valid id

        // Act
        await service.update(id, jsonInputObject);

        // If no error is thrown, fail the test
        expect.fail("Expected ValidationError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("Error");
        expect(error.message).to.equal(`Internal Server Error`);
        expect(mockRepo.update.called).to.be.true;
      }
    });
  });

  describe("delete", () => {
    it("should delete resource with provided PK", async () => {
      // Arrange
      mockRepo.destroy.resolves(1);

      // Act
      const result = await service.delete(1);

      // Assert
      expect(result).to.equal(1);
    });

    it("should respond with resource not found error", async () => {
      // Arrange
      mockRepo.destroy.resolves(0);

      try {
        // Act
        await service.delete(1);

        // If no error is thrown, fail the test
        expect.fail("Expected ResourceError, but no error was thrown.");
      } catch (error) {
        // Assert
        expect(error.constructor.name).to.equal("ResourceError");
        expect(error.message).to.equal("The requested resource was not found");
        expect(mockRepo.destroy.called).to.be.true;
      }
    });

    it("should respond with a 500 Internal service error from the service", async () => {
      try {
        // Arrange
        mockRepo.destroy.throws(new Error("Internal Server Error"));
        const id = 1; // valid id

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
