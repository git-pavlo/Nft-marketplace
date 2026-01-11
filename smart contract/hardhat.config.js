require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    // Local Hardhat network is defined by default
    // Add testnet or mainnet later
    // e.g., goerli:
    // goerli: {
    //   url: process.env.ALCHEMY_GOERLI_URL || "",
    //   accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    // },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    },
  },
};
