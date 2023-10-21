class GuildDTO {
  constructor(id, bnetId, name, guildMasterUserId) {
    this.id = id;
    this.bnetId = bnetId;
    this.name = name;
    this.guildMasterUserId = guildMasterUserId;
  }
}

module.exports = GuildDTO;
