"use strict";

const BaseService = require("./baseService.js");
class BnetService extends BaseService {
  constructor(
    playableClassService,
    playableRaceService,
    realmService,
    guildService,
    characterService
  ) {
    super();
    this.playableClassService = playableClassService;
    this.playableRaceService = playableRaceService;
    this.realmService = realmService;
    this.guildService = guildService;
    this.characterService = characterService;
  }

  async _fetchAndFilterCharacters(accessToken) {
    try {
      // Region for Blizzard request
      const region = "us";

      // Make a request to the Battle.net API to get user characters
      const apiUrl = `https://${region}.api.blizzard.com/profile/user/wow?namespace=profile-us&locale=en_US`;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // convert to json object
      const data = await response.json();

      // Flatten the characters array and filter based on level
      return data.wow_accounts
        .flatMap((account) => account.characters || [])
        .filter((character) => character.level >= 60);
    } catch (error) {
      this.logger.info(`${this.constructor.name}: _fetchAndFilterCharacters`);
      this.logger.error(error);
      throw error;
    }
  }

  async _fetchCharacterProfileSummaries(bnetCharacter, accessToken) {
    try {
      const apiUrl = bnetCharacter.character.href;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Fetch the character profile
      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // convert to json object
      const data = await response.json();

      // Return the character profile data
      return data;
    } catch (error) {
      this.logger.info(`${this.constructor.name}: _fetchAndFilterCharacters`);
      this.logger.error(error);
      throw error;
    }
  }

  _createCharacterDTOS(id, characters) {
    const createCharacterDTOS = [];

    // Create a CharacterDTO for each bnetCharacter
    characters.forEach((character) => {
      const createCharacterDTO = {
        userId: id,
        bnetId: character.id,
        name: character.name,
        realmId: character.realm.id,
        playableClassId: character.playable_class.id,
        playableRaceId: character.playable_race.id,
        gender: character.gender.name.en_US,
        faction: character.faction.name.en_US,
        guildId: character.guild ? character.guild.id : null,
        level: character.level,
      };

      // Add to the createCharacterDTOS array
      createCharacterDTOS.push(createCharacterDTO);
    });

    return createCharacterDTOS;
  }

  _createPlayableRaceDTOS(bnetCharacters) {
    // Create an array to hold multiple Playable Race DTOs
    const createPlayableRaceDTOS = [];

    // Create a PlayableRaceDTO for each bnetCharacter
    bnetCharacters.forEach((bnetCharacter) => {
      const createPlayableRaceDTO = {
        id: bnetCharacter.playable_race.id,
        name: bnetCharacter.playable_race.name,
      };

      // Add to the createPlayableRaceDTOS array
      createPlayableRaceDTOS.push(createPlayableRaceDTO);
    });

    return createPlayableRaceDTOS;
  }

  _createPlayableClassDTOS(bnetCharacters) {
    const createPlayableClassDTOS = [];

    // Create a PlayableClassDTO for each bnetCharacter
    bnetCharacters.forEach((bnetCharacter) => {
      const createPlayableClassDTO = {
        id: bnetCharacter.playable_class.id,
        name: bnetCharacter.playable_class.name,
      };

      // Add to the createPlayableRaceDTOS array
      createPlayableClassDTOS.push(createPlayableClassDTO);

      return createPlayableClassDTO;
    });

    return createPlayableClassDTOS;
  }

  _createRealmDTOS(bnetCharacters) {
    const createRealmDTOS = [];

    // Create a RealmDTO for each bnetCharacter
    bnetCharacters.forEach((bnetCharacter) => {
      const createPlayableClassDTO = {
        id: bnetCharacter.realm.id,
        name: bnetCharacter.realm.name,
        slug: bnetCharacter.realm.slug,
      };

      // Add to the createPlayableRaceDTOS array
      createRealmDTOS.push(createPlayableClassDTO);
    });

    return createRealmDTOS;
  }

  _createGuildDTOS(characters) {
    const createGuildDTOS = [];
    characters.forEach((character) => {
      if (character.guild) {
        console.log(character.guild.name);
        const createGuildDTO = {
          bnetId: character.guild.id,
          name: character.guild.name,
        };

        createGuildDTOS.push(createGuildDTO);
      }
    });

    return createGuildDTOS;
  }

  async handleCallback(id, accessToken) {
    try {
      // Get characters from BNET
      const bnetCharacters = await this._fetchAndFilterCharacters(accessToken);

      // Fetch detailed profiles for all characters
      const fetchProfilePromises = bnetCharacters.map((char) =>
        this._fetchCharacterProfileSummaries(char, accessToken)
      );

      // Wait for the promises to resolve from the map
      const detailedProfiles = await Promise.all(fetchProfilePromises);

      // Combine basic and detailed information here, if necessary.
      const consolidatedCharacters = bnetCharacters.map((char, index) => {
        return { ...char, ...detailedProfiles[index] };
      });

      // Create an array to hold multiple character DTOs
      const createCharacterDTOS = this._createCharacterDTOS(
        id,
        consolidatedCharacters
      );

      // Create an array to hold multiple character DTOs
      const createPlayableRaceDTOS =
        this._createPlayableRaceDTOS(bnetCharacters);

      // Create an array to hold multiple playable classes DTOs
      const createPlayableClassDTOS =
        this._createPlayableClassDTOS(bnetCharacters);

      // Create an array to hold multiple realms DTOs
      const createRealmDTOS = this._createRealmDTOS(bnetCharacters);

      // Create an array to hold multiple guild DTOs
      const createGuildDTOS = this._createGuildDTOS(consolidatedCharacters);

      // Realm upsert
      await this.upsert(createRealmDTOS, this.realmService);

      // Playable race upsert
      await this.upsert(createPlayableRaceDTOS, this.playableRaceService);

      // Playable class upsert
      await this.upsert(createPlayableClassDTOS, this.playableClassService);

      // Guild upsert
      await this.upsert(createGuildDTOS, this.guildService);

      // Character upsert
      await this.upsert(createCharacterDTOS, this.characterService);
    } catch (error) {
      this.logger.info(`${this.constructor.name}: handleCallback`);
      this.logger.error(error);
      throw new Error(`Error fetching user characters: ${error.message}`);
    }
  }

  async upsert(DTOArray, service) {
    try {
      const createPromises = DTOArray.map((DTO) => service.upsert(DTO));

      Promise.allSettled(createPromises).catch((error) => {
        this.logger.error(
          `${service.constructor.name} creation errors:`,
          error
        );
      });
    } catch (error) {
      this.logger.info(`${this.constructor.name}: upsert`);
      this.logger.error(error);
      throw error;
    }
  }
}

module.exports = BnetService;
