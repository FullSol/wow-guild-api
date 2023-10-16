const {
  createSchema: UserCreateSchema,
  updateSchema: UserUpdateSchema,
  createSchema,
} = require("./userValidations");
const { updateSchema: ProfileUpdateSchema } = require("./profileValidations");

module.exports = { UserCreateSchema, UserUpdateSchema, ProfileUpdateSchema };
