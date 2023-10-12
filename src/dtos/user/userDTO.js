class UserDTO {
  constructor(id, username, email, bnetId, bnetAccessToken) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.bnetId = bnetId;
    this.bnetAccessToken = bnetAccessToken;
  }
}

module.exports = UserDTO;
