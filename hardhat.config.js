require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
console.log(SEPOLIA_RPC_URL);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  paths: {
    artifacts: "./staking/src/artifacts",
  },
};
