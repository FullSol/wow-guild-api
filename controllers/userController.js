"use strict";

const { ResourceNotFoundError } = require("../errors/custom");
const logger = require("../logger");
const BaseController = require("./baseController");
const regexExp =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}(?:\/.*)?$/i;

class UserController extends BaseController {
  constructor(service) {
    super(service);
  }

  async getUpdateForm(req, res) {
    try {
      const { id } = req.params;
      const user = await this.service.readOne(id);
      res.render("users/update", { user: user });
    } catch (error) {
      logger.info("user controller: update/:id");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async getSignUpForm(req, res) {
    res.render("users/register", { title: "User Registration" });
  }

  async getSignInForm(req, res) {
    res.render("users/signin", { title: "User Login" });
  }

  async authenticate(req, res) {
    try {
      const { username, password } = req.body;

      const user = await this.service.authenticate({
        username: username,
        password: password,
      });

      req.session.user = user;
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      logger.info("index controller: login");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async logout(req, res) {
    try {
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
      // Attempt to create a new user
      const result = await this.service.create(req.body);

      // Send response
      res.status(201).json(result);
    } catch (error) {
      logger.info("user controller: create");
      logger.error(error.message);
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
      const response = await this.service.readOne(userId);
      const acceptedHeader = req.get("Accept").split(",");
      res.status(200);
      if (acceptedHeader[0] === "text/html")
        res.render("users/read", { user: response });
      else res.json(response);
    } catch (error) {
      logger.info("user controller: get one");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async update(req, res) {
    try {
      const { userId } = req.params;
      if (userId === null || !regexExp.test(userId))
        throw new ResourceNotFoundError("invalid ID request");
      const result = await this.service.update(userId, req.body);

      res.status(200);

      const acceptedHeader = req.get("Accept").split(",");

      if (acceptedHeader[0] === "text/html") {
        res.send();
      } else {
        res.json(result);
      }
    } catch (error) {
      logger.info("user controller: patch");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req.params;
      if (userId === null || !regexExp.test(userId))
        throw new Error("invalid ID request");
      const result = await this.service.delete(userId, req.body);
      if (result === 0)
        res.status(404).send({ message: "no resource found for deletion." });
      else res.status(200).json(result);
    } catch (error) {
      logger.info("user controller: delete");
      logger.error(error.message);
      this._errorHandler(req, res, error);
    }
  }
}

module.exports = UserController;
