"use strict";

const { ResourceNotFoundError } = require("../errors/custom");
const BaseController = require("./baseController");
const { CreateUserDTO, UpdateUserDTO, LoginDTO, UserDTO } = require("../dtos/");

class UserController extends BaseController {
  constructor(service, passport) {
    super(service);
    this.passport = passport;
  }

  async authenticate(req, res) {
    try {
      // Pull the required fields from the body
      const { username, password } = req.body;

      // Create a DTO
      const credentialsDTO = new LoginDTO(username, password);

      // Attempt to authenticate the user
      const result = await this.service.authenticate(credentialsDTO);

      // Create a DTO of the user (without the password)
      const user = {
        id: result.id,
        username: result.username,
        email: result.email,
        bnetId: result.bnetId,
        bnetAccessToken: result.bnetAccessToken,
      };

      // Store the user information in the session
      req.session.user = user;

      // Return the status and user to the client
      res.status(200).json(user);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "authenticate",
        error
      );
    }
  }

  async signout(req, res) {
    try {
      // Destroy the session
      req.session.destroy();

      // Notify client
      res.send("User has been logged out");
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "signout",
        error
      );
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

      // Create DTO to send back to the client
      const userDTO = new UserDTO(result.id, result.username, result.email);

      // Send response
      res.status(201).json(userDTO);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "create",
        error
      );
    }
  }

  async readAll(req, res) {
    try {
      // Attempt to retrieve all users
      const response = await this.service.readAll();

      // Create array of DTOs for each user in the response
      const users = response.map((user) => {
        return new UserDTO(user.id, user.username, user.email);
      });

      // Send response
      res.status(200).json(users);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "readAll",
        error
      );
    }
  }

  async readById(req, res) {
    try {
      // Pull the id from the params
      const { userId } = req.params;

      // Check for valid user id
      if (userId === null || userId === undefined)
        throw new ResourceNotFoundError("Valid user id is required");

      // Attempt to retrieve the user
      const result = await this.service.readById(userId);

      // Check for null results
      if (result === null)
        throw new ResourceNotFoundError("Resource not found");

      // Create DTO to send back to client
      const user = new UserDTO(
        result.id,
        result.username,
        result.email,
        result.bnetId
      );

      // Send user back to the client
      res.status(200).json(user);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "readById",
        error
      );
    }
  }

  async readByUsername(req, res) {
    try {
      // Pull required property form the params
      const { username } = req.params;

      // Check for valid username
      if (username === null)
        throw new ResourceNotFoundError("Valid username is required");

      // Attempt to retrieve the user
      const result = await this.service.readByUsername(username);

      // Check for null results
      if (result === null)
        throw new ResourceNotFoundError("Resource not found");

      // Create DTO to send back to client
      const user = new UserDTO(result.id, result.username, result.email);

      // Send user back to the client
      res.status(200).json(user);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "readByUsername",
        error
      );
    }
  }

  async update(req, res) {
    try {
      // Pull the user's id from the session
      const { id } = req.session.user;

      // Retrieve update fields from the req
      const { username, newPassword, repeatPassword, email, bnetAccessToken } =
        req.body;

      // Create a UpdateDTO
      const updateUserDTO = new UpdateUserDTO(
        id,
        username,
        newPassword,
        repeatPassword,
        email,
        bnetAccessToken
      );

      // Attempt to update the user
      const result = await this.service.update(updateUserDTO);

      // Handle no user
      if (result[0] === 0)
        throw new ResourceNotFoundError("Resource not found");

      // Send success response to client
      res.status(200).send("User successfully updated");
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "update",
        error
      );
    }
  }

  async delete(req, res) {
    try {
      // Pull the user id form the session
      const { id } = req.session.user;

      // Attempt to delete the user
      const result = await this.service.delete(id);

      // Check to ensure successful deletion and respond appropriately
      if (result === 0)
        throw new ResourceNotFoundError("Unable to delete user.");

      // Send successful deletion message
      res.status(200).send("User successfully deleted");
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "delete",
        error
      );
    }
  }

  async authBnet(req, res) {
    console.log("controller is being called");
    const uniqueValue = Math.random().toString(36).substring(7);
    await this.passport.authenticate("bnet", { state: uniqueValue });
    console.log("controller end");
  }

  async authBnetCallback(req, res) {
    this.passport.authenticate("bnet", { failureRedirect: "/" })(
      req,
      res,
      () => {
        const { username } = req.user;
        req.session.user = req.user;

        res.redirect(`http://localhost:3000/`);
      }
    );
  }
}

module.exports = UserController;
