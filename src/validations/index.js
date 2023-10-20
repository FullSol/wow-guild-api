const {
  createSchema: UserCreateSchema,
  updateSchema: UserUpdateSchema,
} = require("./userValidations");
const { updateSchema: ProfileUpdateSchema } = require("./profileValidations");
const {
  createSchema: CharacterCreateSchema,
  updateSchema: CharacterUpdateSchema,
} = require("./characterValidations");

module.exports = {
  UserCreateSchema,
  UserUpdateSchema,
  ProfileUpdateSchema,
  CharacterCreateSchema,
  CharacterUpdateSchema,
};
