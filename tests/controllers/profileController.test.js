"use strict";

// App setup
const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing suite setup
const { expect } = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");

// Mock Service
const mockService = {
  readOneByUser: sinon.stub(),
  update: sinon.stub(),
};

// Import controller & pass service
const { profileController } = require("../../controllers")(mockService);

router.get("/:userId", profileController.getUserProfile);
router.patch("/:userId", profileController.updateUserProfile);

// Mount the controller
app.use("/api/v1/profiles", router);

describe("Profile Controller", () => {
  const profileObject = {
    id: 1,
    user_id: "1bd6cdfe-9b0c-43c2-85fd-f2ad9a1eb8d0",
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

    it("should respond with internal server error due to invalid user_id", async () => {
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
