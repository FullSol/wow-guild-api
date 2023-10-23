class BnetService {
  constructor(
    playableClassService,
    playableRaceService,
    realmService,
    characterService
  ) {
    this.playableClassService = playableClassService;
    this.playableRaceService = playableRaceService;
    this.realmService = realmService;
    this.characterService = characterService;
  }

  async _fetchAndFilterCharacters(accessToken) {
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
  }

  _createCharacterDTOS(id, bnetCharacters) {
    const createCharacterDTOS = [];

    // Create a CharacterDTO for each bnetCharacter
    bnetCharacters.forEach((bnetCharacter) => {
      const createCharacterDTO = {
        userId: id,
        bnetId: bnetCharacter.id,
        name: bnetCharacter.name,
        realmId: bnetCharacter.realm.id,
        playableClassId: bnetCharacter.playable_class.id,
        playableRaceId: bnetCharacter.playable_race.id,
        gender: bnetCharacter.gender.name,
        faction: bnetCharacter.faction.name,
        level: bnetCharacter.level,
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

  async handleCallback(id, accessToken) {
    try {
      // Get characters from BNET
      const bnetCharacters = await this._fetchAndFilterCharacters(accessToken);

      // Create an array to hold multiple character DTOs
      const createCharacterDTOS = this._createCharacterDTOS(id, bnetCharacters);

      // Create an array to hold multiple character DTOs
      const createPlayableRaceDTOS =
        this._createPlayableRaceDTOS(bnetCharacters);

      // Create an array to hold multiple character DTOs
      const createPlayableClassDTOS =
        this._createPlayableClassDTOS(bnetCharacters);

      // Create an array to hold multiple character DTOs
      const createRealmDTOS = this._createRealmDTOS(bnetCharacters);

      // Realm upsert
      await this.upsert(createRealmDTOS, this.realmService);

      // Playable race upsert
      await this.upsert(createPlayableRaceDTOS, this.playableRaceService);

      // Playable class upsert
      await this.upsert(createPlayableClassDTOS, this.playableClassService);

      // Character upsert
      this.upsert(createCharacterDTOS, this.characterService);
    } catch (error) {
      throw new Error(`Error fetching user characters: ${error.message}`);
    }
  }

  async upsert(DTOArray, service) {
    console.log(DTOArray);
    const createPromises = DTOArray.map((DTO) => service.upsert(DTO));

    Promise.allSettled(createPromises).catch((error) => {
      this.logger.error(`${service.constructor.name} creation errors:`, error);
    });
  }
}

module.exports = BnetService;
