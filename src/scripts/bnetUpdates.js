// Import Models
const { User, Character } = require("../models");

// Import Services
const { BnetUpdateService } = require("../services");

// Instantiate service
const bnetUpdateService = new BnetUpdateService(User, Character);

// Updates the mythic plus scores of all characters
async function runUpdateMythicPlusScores() {
  await bnetUpdateService.updateMythicPlusScores();
}

// Run the scripts
runUpdateMythicPlusScores();
