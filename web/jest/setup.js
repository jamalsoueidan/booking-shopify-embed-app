const path = require("path");
const fs = require("fs");
const { MongoMemoryServer } = require("mongodb-memory-server");
const globalConfigPath = path.join(__dirname, "globalConfig.json");

module.exports = async function () {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();

  const mongoConfig = {
    mongoDBName: "jest",
    mongoUri: uri.slice(0, uri.lastIndexOf("/")),
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = instance;
  process.env.MONGO_URL = mongoConfig.mongoUri;
};
