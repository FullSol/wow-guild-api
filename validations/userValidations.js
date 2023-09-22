const Joi = require("joi");

const createSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .messages({
      "string.empty": `Username cannot be empty.`,
      "any.required": `Username is a required field.`,
      "string.base": `Username should be a type of 'text'.`,
      "string.pattern.base": `Username should contain only alphanumeric characters and be between 3 and 30 characters long.`,
    }),
  password: Joi.string().required().messages({
    "string.empty": `Password cannot be empty.`,
    "any.required": `Password is a required field.`,
    "string.base": `Password should be a type of 'text'.`,
  }),
  repeat_password: Joi.valid(Joi.ref("password")).required(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.empty": `Email cannot be empty.`,
      "any.required": `Email is a required field.`,
      "string.base": `Email should be a type of 'text'.`,
      "string.email": `Email should be in a valid format (e.g., user@example.com).`,
    }),
  about: Joi.string().messages({
    "string.empty": `About cannot be empty.`,
    "string.base": `About should be a type of 'text'.`,
  }),
}).options({ abortEarly: false });

const updateSchema = Joi.object({
  username: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).messages({
    "string.empty": `Username cannot be empty.`,
    "any.required": `Username is required.`,
    "string.base": `Username should be a type of 'text'.`,
    "string.pattern.base": `Username should contain only alphanumeric characters and be between 3 and 30 characters long.`,
  }),
  password: Joi.string().when("username", {
    is: Joi.exist(), // Require password when username is provided
    then: Joi.required().messages({
      "any.required": `Current password is required when changing the password.`,
    }),
    otherwise: Joi.forbidden(),
  }),
  new_password: Joi.string().when(Joi.object({ password: Joi.exist() }), {
    is: Joi.exist(), // Require newPassword when changing the password
    then: Joi.required().messages({
      "any.required": `New password is required when changing the password.`,
    }),
    otherwise: Joi.forbidden(),
  }),
  repeat_password: Joi.string()
    .valid(Joi.ref("newPassword"))
    .when("newPassword", {
      is: Joi.exist(), // Require repeatPassword when changing the password
      then: Joi.required().messages({
        "any.required": `Repeat password must match the new password.`,
      }),
      otherwise: Joi.forbidden(),
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.empty": `Email cannot be empty.`,
      "any.required": `Email is required.`,
      "string.base": `Email should be a valid email address.`,
      "string.email": `Email should be in a valid format (e.g., user@example.com).`,
    }),
  about: Joi.string().messages({
    "string.empty": `About cannot be empty.`,
    "string.base": `About should be a type of 'text'.`,
  }),
}).options({ abortEarly: false });

module.exports = {
  createSchema,
  updateSchema,
};
