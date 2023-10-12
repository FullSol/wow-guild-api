"use strict";

const { ResourceNotFoundError } = require("../errors/custom");
const logger = require("../logger");
const BaseController = require("./baseController");
const { CreateUserDTO, UpdateUserDTO, LoginDTO, UserDTO } = require("../dtos/");
const regexExp =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}(?:\/.*)?$/i;

class UserController extends BaseController {
  constructor(service, bnetService) {
    super(service);
    this.bnetService = bnetService;
  }

  async authenticate(req, res) {
    try {
      // Pul the required fields from the body
      const { username, password } = req.body;

      // Create a DTO
      const userDTO = new UserDTO(username, password);

      // Attempt to authenticate the user
      const result = await this.service.authenticate(userDTO);

      // Create a DTO of the user (without the password)
      const user = new UserDTO(
        result.id,
        result.username,
        result.email,
        result.bnetId,
        result.bnetAccessToken
      );

      // Store the user information in the session
      req.session.user = user;

      // Return the status and user to the client
      res.status(200).json(user);
    } catch (error) {
      logger.info("index controller: login");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async logout(req, res) {
    try {
      console.log(req.session);
      logger.info(`${req.session.user} has logged out.`);
      req.session.destroy;
      const acceptedHeader = req.get("Accept").split(",");
      if (acceptedHeader[0] === "text/html") res.redirect("/");
      else res.send("User has been logged out");
    } catch (error) {
      logger.info("index controller: logout");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async create(req, res) {
    try {
      // Retrieve the required parameters from the req.body
      const { username, password, repeatPassword, email } = req.body;

      // Create a DTO for the user
      const newUser = new CreateUserDTO(
        username,
        password,
        repeatPassword,
        email
      );

      // Attempt to create a new user
      const result = await this.service.create(newUser);

      // Create DTO to send back to user
      const userDTO = new UserDTO(result.id, result.username, result.email);

      // Send response
      res.status(201).json(userDTO);
    } catch (error) {
      logger.info("user controller: create");
      logger.error(error);
      this._errorHandler(req, res, error);
    }
  }

  async readAll(req, res) {
    try {
      const response = await this.service.readAll();
      res.status(200);
      const acceptedHeader = req.get("Accept").split(",");
      if (acceptedHeader[0] === "text/html")
        res.render("users/readAll", { users: response });
      else res.json(response);
      return res;
    } catch (error) {
      logger.info("user controller: get all");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async readById(req, res) {
    try {
      const { userId } = req.params;
      if (userId === null || !regexExp.test(userId))
        throw new ResourceNotFoundError("Valid user id is required");

      const response = await this.service.read(userId);
      const acceptedHeader = req.get("Accept").split(",");

      res.status(200);

      if (acceptedHeader[0] === "text/html")
        res.render("users/read", { user: response });
      else res.json(response);
    } catch (error) {
      logger.info("user controller: readById");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async readByUsername(req, res) {
    try {
      const { userName } = req.params;
      if (userName === null)
        throw new ResourceNotFoundError("Valid username is required");

      const response = await this.service.read(userName);
      const acceptedHeader = req.get("Accept").split(",");

      res.status(200);

      if (acceptedHeader[0] === "text/html")
        res.render("users/read", { user: response });
      else res.json(response);
    } catch (error) {
      logger.info("user controller: readById");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async update(req, res) {
    try {
      // Pull the user's id from the session
      const { id } = req.session.user;

      // Retrieve update fields from the req
      const {
        username,
        newPassword,
        repeatPassword,
        email,
        bnetId,
        bnetAccessToken,
      } = req.body;

      // Create a UpdateDTO
      const updateUserDTO = new UpdateUserDTO(
        userId,
        username,
        newPassword,
        repeatPassword,
        email,
        bnetId,
        bnetAccessToken
      );

      // Attempt to update the user
      const result = await this.service.update(updateUserDTO);

      // Create DTO to return the data
      const user = new UserDTO(
        result.id,
        result.username,
        result.email,
        result.bnetId,
        result.bnetAccessToken
      );

      // Set the response status and the updated user
      res.status(200).json(user);
    } catch (error) {
      logger.info("user controller: patch");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async delete(req, res) {
    try {
      // Pull the user id form the session
      const { id } = req.session.user;

      // Attempt to delete the user
      const result = await this.service.delete(userId, req.body);

      // Check to ensure successful deletion and respond appropriately
      if (result === 0)
        res.status(404).send({ message: "no resource found for deletion." });
      else res.status(200).json(result);
    } catch (error) {
      logger.info("user controller: delete");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async authBnet(req, res) {
    // Redirect the user to Blizzard for authentication
    const bnet = this.bnetService.authenticate(req, res);
    console.log(bnet);
  }

  async connectBnet(req, res) {
    const { userId } = req.params;
    const { bnetAccessToken } = req.body;

    // Call the connectBnet method in your BnetService
    this.bnetService.connectBnet(userId, bnetAccessToken);
  }

  async disconnectBnet(req, res) {
    // Call the disconnectBnet method in your BnetService
    this.bnetService.disconnectBnet(req.params.userId);
  }
}

module.exports = UserController;
