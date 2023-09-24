"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");
const express = require("express");
const app = express();
const session = require("express-session");
const Controller = require("../../controllers/indexController");
const {
  AggregateValidationError,
} = require("../../errors/custom/AggregateValidationError");
const {
  SequelizeUniqueConstraintError,
} = require("../../errors/custom/SequelizeUniqueConstraintError");
const { AuthenticationFailureError } = require("../../errors/custom");

const mockService = {
  create: sinon.stub(),
  authenticate: sinon.stub(),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session options
app.use(
  session({
    secret: "this-is-the-song-that-never-ends",
    resave: false, // Save session only if it has been modified
    saveUninitialized: false, // No session for unauthenticated
  })
);

describe.only("Index Controller", () => {
  const user = {
    id: "some-uuid-string",
    username: "test1",
    email: "tes1@gmail.com",
  };

  describe("Register User", () => {
    it("should respond with status 201 on successful registration", async () => {
      // Arrange
      const userData = { username: "test1", password: "password" };
      mockService.create.resolves(user);

      app.use("/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .post("/register")
        .send(userData)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.create.calledOnce).to.be.true;
      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(user);
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

      app.use("/", Controller(mockService));

      const response = await supertest(app)
        .post("/register")
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

    it("should respond with a 500 internal server error", async () => {});
  });

  describe("Authenticate User", () => {
    it("should respond with a 200 user logged in", async () => {
      // Arrange
      const userData = { username: "test1", password: "password" };
      mockService.authenticate.resolves(user);

      app.use("/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .post("/login")
        .send(userData)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.authenticate.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
    });

    it("should respond with status 401 on authentication failure", async () => {
      // Arrange
      const userData = { username: "testuser", password: "password" };
      mockService.authenticate.throws(
        new AuthenticationFailureError("Failed to authenticate user.")
      );

      app.use("/", Controller(mockService));

      // Act
      const response = await supertest(app)
        .post("/login")
        .send(userData)
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.authenticate.calledOnce).to.be.true;
      expect(response.status).to.equal(401);
      expect(response.body.status).to.equal("AuthenticationFailureError");
      expect(response.body.message).to.equal("Failed to authenticate user.");
    });

    it("should respond with a 500 internal server error", async () => {});
  });

  describe("Logout User", () => {
    it("should respond with user logged out message", async () => {});

    it("should respond with a 500 internal server error", async () => {});
  });
});
