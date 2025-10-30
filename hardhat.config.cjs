
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com", // Alternative free RPC endpoint
      accounts: ["6138b9e5da2c8340328d7d7c92bd3c3ea072e5fda3510aeb04423acc5e4b151d"],
      chainId: 11155111,
      timeout: 60000 // Increase timeout to 60 seconds
    },
  },
};
