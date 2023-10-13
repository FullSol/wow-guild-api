class UpdateProfileDTO {
  constructor(
    userId,
    about,
    bnetHandle,
    twitterHandle,
    facebookHandle,
    discordHandle,
    youtubeHandle
  ) {
    this.userId = userId;
    this.about = about;
    this.bnetHandle = bnetHandle;
    this.twitterHandle = twitterHandle;
    this.facebookHandle = facebookHandle;
    this.discordHandle = discordHandle;
    this.youtubeHandle = youtubeHandle;
  }
}

module.exports = UpdateProfileDTO;
