const Joi = require("joi");

const updateSchema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.empty": `UUID cannot be empty.`,
    "any.required": `UUID is a required field.`,
    "string.guid": `UUID must be in UUIDv4 format.`,
  }),
  battleNet: Joi.string()
    .pattern(new RegExp("^[A-Za-z0-9]+#[0-9]+$"))
    .messages({
      "string.empty": `battle_net cannot be empty.`,
      "string.base": `battle_net should be a type of 'text'.`,
      "string.pattern.base": `battle_net should follow the blizzard required pattern`,
    }),
}).options({ abortEarly: false });

module.exports = {
  updateSchema,
};
