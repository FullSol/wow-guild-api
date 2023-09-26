const Joi = require("joi");

const updateSchema = Joi.object({
  battle_net: Joi.string().pattern(new RegExp("")).messages({
    "string.empty": `battle_net cannot be empty.`,
    "any.required": `battle_net is a required field.`,
    "string.base": `battle_net should be a type of 'text'.`,
    "string.pattern.base": `battle_net should follow the blizzard required pattern`,
  }),
}).options({ abortEarly: false });

module.exports = {
  updateSchema,
};
