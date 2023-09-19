"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");
const express = require("express");
const Controller = require("../../controllers/profileController");
const {
  AggregateValidationError,
} = require("../../errors/custom/AggregateValidationError");
const {
  SequelizeUniqueConstraintError,
} = require("../../errors/custom/SequelizeUniqueConstraintError");

const app = express();

const mockService = {
  create: sinon.stub(),
  readAll: sinon.stub(),
  readOne: sinon.stub(),
  update: sinon.stub(),
  destroy: sinon.stub(),
};

describe("Profile Controller", () => {
  describe("POST /api/v1/profiles", () => {
    it("should respond with 200", async () => {
      // Arrange
      const validJsonObject = {
        field1: "data1",
      };
      mockService.create.resolves(1);

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .post("/api/v1/profiles/")
        .send(validJsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.create.calledOnce).to.be.true;
      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal({
        message: "Profile created successfully",
      });
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

      app.use("/api/v1/profiles", Controller(mockService));

      const response = await supertest(app)
        .post("/api/v1/profiles")
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
            instance: ["Profile"],
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

      app.use("/api/v1/profiles", Controller(mockService));

      const response = await supertest(app)
        .post("/api/v1/profiles")
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

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .post("/api/v1/profiles/")
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

  describe("GET /api/v1/profiles", () => {
    it("Should respond with an array of objects", async () => {
      // Arrange
      const jsonObject = [
        {
          field1: "data1",
        },
      ];

      mockService.readAll.resolves(jsonObject);

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/")
        .send(jsonObject)
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

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/")
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

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/")
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

  describe("GET /api/v1/profiles/:id", () => {
    it("Should respond with an object based on id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };
      mockService.readOne.resolves(jsonObject);

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/1")
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

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/doggie")
        .send(jsonObject)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOne.calledOnce).to.be.false;
      expect(response.status).to.equal(500);
    });

    it("Should respond with an empty array", async () => {
      // Arrange
      const jsonObject = [];

      mockService.readOne.resolves(jsonObject);

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/1")
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

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/1")
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

  describe("PATCH /api/v1/profiles/:id", () => {
    it("Should respond with an object based on id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };
      mockService.update.resolves(1);

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .patch("/api/v1/profiles/1")
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

      app.use("/api/v1/profiles", Controller(mockService));

      const response = await supertest(app)
        .patch("/api/v1/profiles/1")
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

    it("should respond with internal server error due to invalid id", async () => {
      // Arrange
      const jsonObject = {
        field1: "data1",
      };
      mockService.update.resolves(jsonObject);

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .patch("/api/v1/profiles/doggie")
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

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/1")
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

  describe("DELETE /api/v1/profiles/:id", () => {
    it("Should respond with an object based on id", async () => {
      // Arrange
      mockService.destroy.resolves(1);

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .delete("/api/v1/profiles/1")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.destroy.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.equal(1);
    });

    it("should respond with internal server error due to invalid id", async () => {
      // Arrange
      mockService.destroy.resolves(1);

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .delete("/api/v1/profiles/doggie")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.destroy.called).to.be.false;
      expect(response.status).to.equal(500);
    });

    it("Should respond with a no deletion message", async () => {
      // Arrange
      mockService.destroy.resolves(0);

      app.use("/api/v1/profiles", Controller(mockService));

      // Act
      const response = await supertest(app)
        .delete("/api/v1/profiles/1")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.destroy.calledOnce).to.be.true;
      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({
        message: "no resource found for deletion.",
      });
    });

    it("Should respond with 500 internal server error from service", async () => {
      // Arrange
      mockService.destroy.throws(new Error("Internal Server Error"));

      app.use("/api/v1/profiles/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .delete("/api/v1/profiles/1")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.destroy.calledOnce).to.be.true;
      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({
        status: "error",
        message: "Internal Server Error",
      });
    });
  });
});
