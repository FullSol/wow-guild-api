const Joi = require("joi");

const updateSchema = Joi.object({
  about: Joi.string().messages({
    "string.empty": `battle_net cannot be empty.`,
    "string.base": `battle_net should be a type of 'text'.`,
  }),
}).options({ abortEarly: false });

module.exports = {
  updateSchema,
};
