const BaseController = require("./baseController");
const { CharacterDTO } = require("../dtos");

class CharacterController extends BaseController {
  constructor(service) {
    super(service);
  }

  readAllUserCharacters = async (req, res) => {
    // Get the user's id
    const { id } = req.session.user;

    //Attempt to retrieve all characters
    const response = await this.service.readAllUserCharacters(id);

    // Create array of DTOs for each character in the response
    const characters = response.map((character) => {
      return new CharacterDTO(
        character.id,
        character.name,
        character.realm,
        character.playableRace,
        character.playableClass,
        character.gender,
        character.faction,
        character.level
      );
    });

    // Send response
    res.status(200).json(characters);
  };
}

module.exports = CharacterController;
