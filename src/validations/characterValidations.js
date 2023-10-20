const Joi = require("Joi");

const createSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": `userId cannot be empty.`,
    "any.required": `userId is a required field.`,
    "string.base": `userId should be a type of 'text'.`,
  }),

  bnetId: Joi.number().required().messages({
    "integer.empty": `bnetId cannot be empty.`,
    "any.required": `bnetId is a required field.`,
    "integer.base": `bnetId should be a type of 'text'.`,
  }),
  name: Joi.string().required().messages({
    "string.empty": `name cannot be empty.`,
    "any.required": `name is a required field.`,
    "string.base": `name should be a type of 'text'.`,
  }),
  realm: Joi.string().required().messages({
    "string.empty": `realm cannot be empty.`,
    "any.required": `realm is a required field.`,
    "string.base": `realm should be a type of 'text'.`,
  }),
  playableClass: Joi.string().required().messages({
    "string.empty": `playableClass cannot be empty.`,
    "any.required": `playableClass is a required field.`,
    "string.base": `playableClass should be a type of 'text'.`,
  }),
  playableRace: Joi.string().required().messages({
    "string.empty": `playableRace cannot be empty.`,
    "any.required": `playableRace is a required field.`,
    "string.base": `playableRace should be a type of 'text'.`,
  }),
  gender: Joi.string().required().messages({
    "string.empty": `gender cannot be empty.`,
    "any.required": `gender is a required field.`,
    "string.base": `gender should be a type of 'text'.`,
  }),
  faction: Joi.string().required().messages({
    "string.empty": `faction cannot be empty.`,
    "any.required": `faction is a required field.`,
    "string.base": `faction should be a type of 'text'.`,
  }),
  level: Joi.number().required().messages({
    "integer.empty": `level cannot be empty.`,
    "any.required": `level is a required field.`,
    "integer.base": `level should be a type of 'text'.`,
  }),
});

const updateSchema = Joi.object({});

module.exports = {
  createSchema,
  updateSchema,
};
