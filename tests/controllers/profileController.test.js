"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");
const express = require("express");
const Controller = require("../../controllers/profileController");
const {
  AggregateValidationError,
} = require("../../errors/custom/AggregateValidationError");
const app = express();

const mockService = {
  create: sinon.stub(),
};

describe.only("Profile Controller", () => {
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
      const message = "Validation Error";

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
      expect(response.body.message).to.equal("Validation failed");
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
        message: "Internal Server Error",
      });
    });
  });
});
