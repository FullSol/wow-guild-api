const Joi = require("joi");

const updateSchema = Joi.object({
  about: Joi.string().messages({
    "string.empty": `about cannot be empty.`,
    "string.base": `about should be a type of 'text'.`,
  }),
  bnetHandle: Joi.string().messages({
    "string.empty": `bnetHandle cannot be empty.`,
    "string.base": `bnetHandle should be a type of 'text'.`,
  }),
  twitterHandle: Joi.string().messages({
    "string.empty": `twitterHandle cannot be empty.`,
    "string.base": `twitterHandle should be a type of 'text'.`,
  }),
  facebookHandle: Joi.string().messages({
    "string.empty": `facebookHandle cannot be empty.`,
    "string.base": `facebookHandle should be a type of 'text'.`,
  }),
  discordHandle: Joi.string().messages({
    "string.empty": `discordHandle cannot be empty.`,
    "string.base": `discordHandle should be a type of 'text'.`,
  }),
  youtubeHandle: Joi.string().messages({
    "string.empty": `youtubeHandle cannot be empty.`,
    "string.base": `youtubeHandle should be a type of 'text'.`,
  }),
}).options({ abortEarly: false });

module.exports = {
  updateSchema,
};
