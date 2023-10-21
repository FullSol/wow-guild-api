const BaseController = require("./baseController");
const { GuildDTO } = require("../dtos");

class GuildController extends BaseController {
  constructor(service) {
    super(service);
  }

  async create(req, res) {
    const { realm, guildName } = req.body;

    const guildDTO = {
      realm: realm,
      guildName: guildName,
    };

    const result = this.service.create(guildDTO);
  }

  async readAll(req, res) {
    try {
      // Attempt to retrieve all users
      const response = await this.service.readAll();

      // Create array of DTOs for guid user in the response
      const users = response.map((guild) => {
        return new GuildDTO(
          guild.id,
          guild.bnetId,
          guild.name,
          guild.guildMasterUserId
        );
      });

      // Send response
      res.status(200).json(users);
    } catch (error) {
      this._handleControllerError(
        req,
        res,
        this.constructor.name,
        "readAll",
        error
      );
    }
  }
}

module.exports = GuildController;
