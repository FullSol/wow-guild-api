"use strict";

const Joi = require("joi");

const createSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .messages({
      "string.empty": `username cannot be a empty field`,
      "any.required": `username is a required field`,
      "string.base": `username should be a type of 'text'`,
    }),
  password: Joi.string().required().messages({
    "string.empty": `password cannot be a empty field`,
    "any.required": `password is a required field`,
    "string.base": `password should be a type of 'text'`,
  }),
  repeat_password: Joi.valid(Joi.ref("password")).required(),
  email: Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.empty": `email cannot be a empty field`,
      "any.required": `email is a required field`,
      "string.base": `email should be a type of 'text'`,
    }),
  // battleTag: Joi.string().messages({
  //   "string.empty": `battleTag cannot be a empty field`,
  //   "string.base": `battleTag should be a type of 'text'`,
  // }),
  // discord: Joi.string().messages({
  //   "string.empty": `discord cannot be a empty field`,
  //   "string.base": `discord should be a type of 'text'`,
  // }),
  // twitch: Joi.string().messages({
  //   "string.empty": `twitch cannot be a empty field`,
  //   "string.base": `twitch should be a type of 'text'`,
  // }),
  // x: Joi.string().messages({
  //   "string.empty": `twitter cannot be a empty field`,
  //   "string.base": `twitter should be a type of 'text'`,
  // }),
  // youtube: Joi.string().messages({
  //   "string.empty": `youtube cannot be a empty field`,
  //   "string.base": `youtube should be a type of 'text'`,
  // }),
  // wowhead: Joi.string().messages({
  //   "string.empty": `wowhead cannot be a empty field`,
  //   "string.base": `wowhead should be a type of 'text'`,
  // }),
  // primary_language: Joi.string().messages({
  //   "string.empty": `primary_language cannot be a empty field`,
  //   "string.base": `primary_language should be a type of 'text'`,
  // }),
  about: Joi.string().messages({
    "string.empty": `about cannot be a empty field`,
    "string.base": `about should be a type of 'text'`,
  }),
}).options({ abortEarly: false });

const updateSchema = Joi.object({
  username: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).messages({
    "string.empty": `username cannot be a empty field`,
    "any.required": `username is a required field`,
    "string.base": `username should be a type of 'text'`,
  }),
  password: Joi.string().messages({
    "string.empty": `password cannot be a empty field`,
    "string.base": `password should be a type of 'text'`,
  }),
  repeat_password: Joi.ref("password"),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.empty": `email cannot be a empty field`,
      "any.required": `email is a required field`,
      "string.base": `email should be a type of 'email'`,
    }),
  // battleTag: Joi.string().messages({
  //   "string.empty": `battleTag cannot be a empty field`,
  //   "any.required": `battleTag is a required field`,
  //   "string.base": `battleTag should be a type of 'text'`,
  // }),
  // discord: Joi.string().messages({
  //   "string.empty": `discord cannot be a empty field`,
  //   "any.required": `discord is a required field`,
  //   "string.base": `discord should be a type of 'text'`,
  // }),
  // twitch: Joi.string().messages({
  //   "string.empty": `twitch cannot be a empty field`,
  //   "string.base": `twitch should be a type of 'text'`,
  // }),
  // x: Joi.string().messages({
  //   "string.empty": `twitter cannot be a empty field`,
  //   "string.base": `twitter should be a type of 'text'`,
  // }),
  // youtube: Joi.string().messages({
  //   "string.empty": `youtube cannot be a empty field`,
  //   "string.base": `youtube should be a type of 'text'`,
  // }),
  // wowhead: Joi.string().messages({
  //   "string.empty": `wowhead cannot be a empty field`,
  //   "string.base": `wowhead should be a type of 'text'`,
  // }),
  // primary_language: Joi.string().messages({
  //   "string.empty": `primary_language cannot be a empty field`,
  //   "string.base": `primary_language should be a type of 'text'`,
  // }),
  about: Joi.string().messages({
    "string.empty": `about cannot be a empty field`,
    "string.base": `about should be a type of 'text'`,
  }),
})
  .options({ abortEarly: false })
  .with("username", "password")
  .with("password", "repeat_password");

module.exports = {
  createSchema,
  updateSchema,
};
