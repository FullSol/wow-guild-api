class CharacterDTO {
  constructor(
    id,
    name,
    realm,
    playableRace,
    playableClass,
    gender,
    faction,
    level
  ) {
    this.id = id;
    this.name = name;
    this.realm = realm;
    this.playableRace = playableRace;
    this.playableClass = playableClass;
    this.gender = gender;
    this.faction = faction;
    this.level = level;
  }
}

module.exports = CharacterDTO;
