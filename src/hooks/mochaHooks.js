const sinon = require("sinon");

exports.mochaHooks = {
  afterEach() {
    if (sinon.restore) sinon.reset();
  },
};
