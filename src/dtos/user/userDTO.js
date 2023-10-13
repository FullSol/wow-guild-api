class UserDTO {
  constructor(id, username, email, bnetId, bnetAccessToken) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.bnetId = bnetId;
  }
}

module.exports = UserDTO;
