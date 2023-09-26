const {
  createSchema: UserCreateSchema,
  updateSchema: UserUpdateSchema,
} = require("./userValidations");
const { createSchema: ProfileCreateSchema } = require("./profileValidations");

module.exports = { UserCreateSchema, UserUpdateSchema, ProfileCreateSchema };
