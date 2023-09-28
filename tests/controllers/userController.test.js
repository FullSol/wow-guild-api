"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");

const express = require("express");
const router = express.Router();
const app = express();
const {
  AggregateValidationError,
  SequelizeUniqueConstraintError,
  ResourceNotFoundError,
} = require("../../errors/custom/");

// Mock Service
const mockService = {
  create: sinon.stub(),
  readAll: sinon.stub(),
  readOne: sinon.stub(),
  update: sinon.stub(),
  delete: sinon.stub(),
};

// Import controller & pass service
const { userController } = require("../../controllers")(mockService);

// Routes [the app routes injects the dependencies - we don't want that here]
router.post("/", userController.create);
router.get("/:userId", userController.readById);
router.get("/", userController.readAll);
router.patch("/:userId", userController.update);
router.delete("/:userId", userController.delete);

// Mount the controller
app.use("/api/v1/users", router);

describe("User Controller", () => {
  describe("POST /api/v1/users", () => {
    it("should respond with 200", async () => {
      // Arrange
      const validJsonObject = {
        field1: "data1",
      };
      const jsonObject = {
        id: 1,
        field1: "data1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      mockService.create.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .post("/api/v1/users/")
        .send(validJsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.create.calledOnce).to.be.true;
      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(jsonObject);
    });

    it("should respond with 400 ValidationError", async () => {
      // Arrange
      const invalidJsonObject = {}; // bad object
      const errors = [
        {
          message: '"username" is required',
          path: ["username"],
          type: "any.required",
          context: {
            key: "username",
          },
        },
      ];
      const message = "Unable to process request due to validation failure";

      mockService.create.throws(new AggregateValidationError(errors, message));

      const response = await supertest(app)
        .post("/api/v1/users")
        .send(invalidJsonObject)
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.create.calledOnce).to.be.true;
      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.message).to.equal(message);
      expect(response.body.data.errors).to.be.an("array").that.is.not.empty;
    });

    it("should respond with a unique constraint error", async () => {
      // Arrange
      const duplicateObject = {
        username: "testUser",
      }; // bad object
      const errors = [
        {
          ValidationErrorItem: {
            message: "username must be unique",
            type: "unique violation",
            path: "username",
            value: "testUser",
            origin: "DB",
            instance: ["User"],
            validatorKey: "not_unique",
            validatorName: null,
            validatorArgs: [],
          },
        },
      ];

      const message = "Unable to process request due to duplicate entry";

      mockService.create.throws(
        new SequelizeUniqueConstraintError(errors, message)
      );

      const response = await supertest(app)
        .post("/api/v1/users")
        .send(duplicateObject)
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.create.calledOnce).to.be.true;
      expect(response.status).to.equal(422);
      expect(response.body.status).to.equal("Unique Constraint Error");
      expect(response.body.message).to.equal(message);
      expect(response.body.data.errors).to.be.an("array").that.is.not.empty;
    });

    it("should respond with 500 internal server error from service", async () => {
      // Arrange
      const validJsonObject = {
        field1: "data1",
      };

      mockService.create.throws(new Error("Internal Server Error"));

      // Act
      const response = await supertest(app)
        .post("/api/v1/users/")
        .send(validJsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.create.calledOnce).to.be.true;
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        status: "error",
        message: "Internal Server Error",
      });
    });
  });

  describe("GET /api/v1/users", () => {
    it("Should respond with an array of objects", async () => {
      // Arrange
      const jsonObject = [
        {
          field1: "data1",
        },
      ];

      mockService.readAll.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);
      // Assert
      expect(mockService.readAll.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(jsonObject);
    });

    it("Should respond with an empty array", async () => {
      // Arrange
      const jsonObject = [];

      mockService.readAll.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readAll.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(jsonObject);
    });

    it("Should respond with 500 internal server error from service", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };

      mockService.readAll.throws(new Error("Internal Server Error"));

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readAll.calledOnce).to.be.true;
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        status: "error",
        message: "Internal Server Error",
      });
    });
  });

  describe("GET /api/v1/users/:id", () => {
    it("Should respond with an object based on id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };

      mockService.readOne.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(jsonObject);
    });

    it("should respond with internal server error due to invalid id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };
      mockService.readOne.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/doggie")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.false;
      expect(response.status).to.equal(500);
    });

    it("Should respond with a ResourceNotFoundError", async () => {
      // Arrange
      mockService.readOne.throws(
        new ResourceNotFoundError("Resource not found")
      );

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.true;
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        status: "ResourceNotFoundError",
        message: "Resource not found",
      });
    });

    it("Should respond with an empty array", async () => {
      // Arrange
      const jsonObject = [];

      mockService.readOne.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(jsonObject);
    });

    it("Should respond with 500 internal server error from service", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };

      mockService.readOne.throws(new Error("Internal Server Error"));

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.true;
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        status: "error",
        message: "Internal Server Error",
      });
    });
  });

  describe("PATCH /api/v1/users/:id", () => {
    it("Should respond with an object based on id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };
      mockService.update.resolves(1);

      // Act
      const response = await supertest(app)
        .patch("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.update.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(1);
    });

    it("should respond with 400 ValidationError", async () => {
      // Arrange
      const invalidJsonObject = {}; // bad object
      const errors = [
        {
          message: '"username" is required',
          path: ["username"],
          type: "any.required",
          context: {
            key: "username",
          },
        },
      ];
      const message = "Unable to process request due to validation failure";

      mockService.update.throws(new AggregateValidationError(errors, message));

      const response = await supertest(app)
        .patch("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .send(invalidJsonObject)
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.update.calledOnce).to.be.true;
      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.message).to.equal(message);
      expect(response.body.data.errors).to.be.an("array").that.is.not.empty;
    });

    it("Should respond with a ResourceNotFoundError", async () => {
      // Arrange
      mockService.update.throws(
        new ResourceNotFoundError("Resource not found")
      );

      // Act
      const response = await supertest(app)
        .patch("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.update.calledOnce).to.be.true;
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        status: "ResourceNotFoundError",
        message: "Resource not found",
      });
    });

    it("should respond with internal server error due to invalid id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };
      mockService.update.resolves(jsonObject);

      // Act
      const response = await supertest(app)
        .patch("/api/v1/users/doggie")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.update.calledOnce).to.be.false;
      expect(response.status).to.equal(500);
    });

    it("Should respond with 500 internal server error from service", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };

      mockService.readOne.throws(new Error("Internal Server Error"));

      // Act
      const response = await supertest(app)
        .get("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.true;
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        status: "error",
        message: "Internal Server Error",
      });
    });
  });

  describe("DELETE /api/v1/users/:id", () => {
    it("Should respond with an object based on id", async () => {
      // Arrange
      mockService.delete.resolves(1);

      // Act
      const response = await supertest(app)
        .delete("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.delete.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.equal(1);
    });

    it("should respond with internal server error due to invalid id", async () => {
      // Arrange
      mockService.delete.resolves(1);

      // Act
      const response = await supertest(app)
        .delete("/api/v1/users/doggie")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.delete.called).to.be.false;
      expect(response.status).to.equal(500);
    });

    it("Should respond with a ResourceNotFoundError", async () => {
      // Arrange
      mockService.delete.throws(
        new ResourceNotFoundError("Resource not found")
      );

      // Act
      const response = await supertest(app)
        .delete("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.delete.calledOnce).to.be.true;
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        status: "ResourceNotFoundError",
        message: "Resource not found",
      });
    });

    it("Should respond with 500 internal server error from service", async () => {
      // Arrange
      mockService.delete.throws(new Error("Internal Server Error"));

      // Act
      const response = await supertest(app)
        .delete("/api/v1/users/04072a64-ae75-4825-9025-420c9d4d8eaa")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.delete.calledOnce).to.be.true;
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        status: "error",
        message: "Internal Server Error",
      });
    });
  });
});
