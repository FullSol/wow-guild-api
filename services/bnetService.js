class bnetService {
  constructor() {}

  authorize = (userId) => {
    const authorizeUri = "https://oauth.battle.net/authorize";
    const client_id = process.env.BNET_ID;
    const callbackUrl = `http://localhost:3001/users/connectBnet`;
    const scope = "wow.profile";
  };

  connectBnet = (userId, bnetAccessToken) => {};

  disconnectBnet = (userId) => {};
}

module.exports = bnetService;
