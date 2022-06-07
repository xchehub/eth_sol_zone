import React from "react";
import { ethers } from "ethers";

export const BlockchainContext = React.createContext({
  currentAccount: null,
  provider: null,
  chain: null,
});

const BlockchainContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const [chain, setChain] = React.useState('rinkeby');

  React.useEffect(() => {
    const updateCurrentAccounts = (accounts) => {
      const [_account] = accounts;
      setCurrentAccount(_account);
    };

    // window.ethereum
    //   ?.request({ method: "eth_requestAccounts" })
    //   .then(updateCurrentAccounts);

    const requestAccount = async () => {
      window.ethereum
        ?.request({ method: "eth_requestAccounts" })
        .then(updateCurrentAccounts);
      window.ethereum?.on("accountsChanged", updateCurrentAccounts);
    };

    requestAccount();

    const hintChangeCurrentChain = (chainId) => {
      if (chainId !== "0x4" || !chainId) {
        window.ethereum
          ?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4" }],
          })
          .catch((error) => {
            if (error.code == -32002) {
              window.alert("請確認 metamask鏈是否為 Rinkeby");
            }
          });
      }
    };

    window.ethereum?.on("chainChanged", hintChangeCurrentChain);
    window.ethereum
      ?.request({
        method: "net_version",
      })
      .then((networkId) => {
        if (networkId !== "4") {
          hintChangeCurrentChain();
        }
      });
  }, []);

  React.useEffect(() => {
    console.log(window.ethereum, 'window.ethereum')
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // setProvider(provider)
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }, []);
  return (
    <BlockchainContext.Provider value={{ currentAccount, provider }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContextProvider;
