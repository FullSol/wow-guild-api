class ProfileDTO {
  constructor(
    id,
    userId,
    about,
    bnetHandle,
    twitterHandle,
    facebookHandle,
    discordHandle,
    youtubeHandle,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.userId = userId;
    this.about = about;
    this.bnetHandle = bnetHandle;
    this.twitterHandle = twitterHandle;
    this.facebookHandle = facebookHandle;
    this.discordHandle = discordHandle;
    this.youtubeHandle = youtubeHandle;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = ProfileDTO;
