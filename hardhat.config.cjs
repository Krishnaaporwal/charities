
require("@nomicfoundation/hardhat-ethers");



module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY", // Replace with your Alchemy/Infura URL
      accounts: ["6138b9e5da2c8340328d7d7c92bd3c3ea072e5fda3510aeb04423acc5e4b151d"], // Replace with your wallet's private key
    },
  },
};
