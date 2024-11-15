const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "0.0.0.0",
      port: 8545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
