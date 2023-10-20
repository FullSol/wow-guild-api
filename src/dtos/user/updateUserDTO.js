class UpdateUserDTO {
  constructor(
    id,
    username,
    newPassword,
    repeatPassword,
    email,
    bnetId,
    bnetAccessToken
  ) {
    this.id = id;
    this.username = username;
    this.newPassword = newPassword;
    this.repeatPassword = repeatPassword;
    this.email = email;
    this.bnetId = bnetId;
    this.bnetAccessToken = bnetAccessToken;
  }
}

module.exports = UpdateUserDTO;
