class UpdateUserDTO {
  /**
   *
   * @param {string} id
   * @param {string} username
   * @param {string} newPassword
   * @param {string} repeatPassword
   * @param {string} email
   * @param {string} bnetAccessToken
   */
  constructor(
    id,
    username,
    newPassword,
    repeatPassword,
    email,
    bnetAccessToken
  ) {
    this.id = id;
    this.username = username;
    this.newPassword = newPassword;
    this.repeatPassword = repeatPassword;
    this.email = email;
    this.bnetAccessToken = bnetAccessToken;
  }
}

module.exports = UpdateUserDTO;
