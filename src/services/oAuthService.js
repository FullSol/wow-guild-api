const { ClientCredentials } = require("simple-oauth2");
const logger = "../logger.js";

class OAuthClient {
  constructor() {
    this.credentials = {
      client: {
        id: process.env.BNET_CLIENT_ID,
        secret: process.env.BNET_CLIENT_SECRET,
      },
      auth: {
        tokenHost: "https://us.battle.net/",
        tokenPath: "oauth/token",
      },
    };

    this.oauth2 = new ClientCredentials(this.credentials);
  }

  async getToken() {
    try {
      const token = await this.oauth2.getToken();
      return token.token.access_token;
    } catch (error) {
      logger.info(`${this.constructor.name}: getToken()`);
      logger.error(error);
      throw error;
    }
  }
}

module.exports = OAuthClient;
