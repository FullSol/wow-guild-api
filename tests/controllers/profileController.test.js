"use strict";

const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");

const express = require("express");
const app = express();

// Mock Service
const mockService = {
  readOneByUser: sinon.stub(),
  update: sinon.stub(),
  readOne: sinon.stub(),
  delete: sinon.stub(),
};

// Import the controller
const { ProfileController } = require("../../controllers");
const profileController = new ProfileController(mockService);

const profileRoutes = require("../../routes/api/profileRoutes")(
  profileController
);

// Mount the routes
app.use("/api/v1/profiles", profileRoutes);

describe("Profile Controller", () => {
  const profileObject = {
    id: 1,
    userId: "1bd6cdfe-9b0c-43c2-85fd-f2ad9a1eb8d0",
    battle_net: "test#1234",
    createdAt: "2023-09-26T22:12:51.122Z",
    updatedAt: "2023-09-26T22:12:51.122Z",
  };

  describe("GET /api/v1/profiles/:userId", async () => {
    it("Should respond with an object based on user id", async () => {
      // Arrange
      mockService.readOneByUser.resolves(profileObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/1bd6cdfe-9b0c-43c2-85fd-f2ad9a1eb8d0")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOneByUser.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(profileObject);
    });

    it("should respond with internal server error due to invalid userId", async () => {
      // Arrange
      mockService.readOneByUser.resolves(profileObject);

      // Act
      const response = await supertest(app)
        .get("/api/v1/profiles/invalid-id")
        .set("Accept", "application/json")
        .then((response) => response)
        .catch((error) => error);

      // Assert
      expect(mockService.readOneByUser.calledOnce).to.be.true;
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(profileObject);
    });

    it("Should respond with a ResourceNotFoundError", async () => {});

    it("Should respond with an empty array", async () => {});

    it("Should respond with 500 internal server error from service", async () => {});
  });
});
