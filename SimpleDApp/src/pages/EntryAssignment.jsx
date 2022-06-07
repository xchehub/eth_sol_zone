import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { BlockchainContext } from "../contexts/BlockchainContext";

const contractAddress = "0xa680F60AD58000F87Cdf9EA94A5c68ac8583c6EB";
const contractABI = [
  {
    inputs: [],
    name: "counter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "setIncrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const EntryAssignment = () => {
  const { currentAccount, provider } = useContext(BlockchainContext);
  const [contract, setContract] = useState();
  useEffect(() => {

    if (provider) {
      // console.log(provider)
      const signer = provider.getSigner();

      // const _contract = new ethers.Contract(
      //   contractAddress,
      //   contractABI,
      //   provider,
      // );
      // setContract(_contract.connect(signer));

      provider.getBlock().then((block) => {
        const _contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider,
          {
            gasLimit: block.gasLimit,
          }
        );
        setContract(_contract.connect(signer));
      });
    }
  }, [provider]);

  const [counter, setCounter] = useState();
  useEffect(() => {
    const getCounter = async () => {
      const _counter = await contract.counter();
      setCounter(_counter.toNumber());
    };

    if (contract) {
      getCounter();
    }
  }, [contract]);

  const onIncrement = async () => {
    if (contract) {
      await contract.setIncrement({ from: currentAccount }); 
    }
  };

  useEffect(() => {

    let interval;
    if (contract) {
      interval = window.setInterval(async () => {
        const _counter = await contract.counter();
        console.log(_counter);
        setCounter(_counter.toNumber());
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [contract]);

  return (
    <Layout>
      <h1>基礎作業: Counter</h1>

      <div>
        {/* <div>My key: {myKey}</div> */}
        <div>錢包地址：{currentAccount}</div>
        <div>鏈上資料:</div>
        <div className="my-3">
          <div className="mb-1">counter: {counter}</div>
          <button onClick={onIncrement}>counter + 1</button>
        </div>
      </div>
    </Layout>
  );
};

export default EntryAssignment;
