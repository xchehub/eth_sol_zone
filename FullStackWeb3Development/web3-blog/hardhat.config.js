require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // mumbai: {
    //   url: "https://rpc-mumbai.matic.today",
    //   account: [process.env.pk]
    // },
    // polygon: {
    //   url: "https://polygon-rpc.com",
    //   account: [process.env.pk]
    // }
  }
};
