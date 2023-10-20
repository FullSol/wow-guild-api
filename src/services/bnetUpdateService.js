class BnetUpdateService {
  constructor(user, character) {
    this.User = user;
    this.Character = character;
  }

  updateMythicPlusScores = async () => {
    //TODO: Build this out once mythic plus scores are implemented
    console.log(this.constructor.name);
  };
}

module.exports = BnetUpdateService;
