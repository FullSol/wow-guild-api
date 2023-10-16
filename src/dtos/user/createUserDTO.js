class CreateUserDTO {
  /**
   *
   * @param {string} username
   * @param {string} password
   * @param {string} newPassword
   * @param {string} repeatPassword
   */
  constructor(username, password, repeatPassword, email) {
    this.username = username;
    this.password = password;
    this.repeatPassword = repeatPassword;
    this.email = email;
  }
}

module.exports = CreateUserDTO;
