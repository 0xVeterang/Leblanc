"use client";
import Web3 from "web3";
import { useState, useEffect } from "react";
import BfcStakingABI from "../abi/bfc_staking.json";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare let window: EthereumWindow;

export default function NominatortorInfo({
  address_id,
}: {
  address_id: string;
}) {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [outputData, setOutputData] = useState<any[]>([]);

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const provider = new Web3(window.ethereum);
        setWeb3(provider);

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccounts(accounts);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("Please install MetaMask.");
      }
    }

    loadWeb3();
  }, []);

  useEffect(() => {
    async function getNominatorList(address_id: string) {
      if (web3) {
        const contractAddress = "0x0000000000000000000000000000000000000400";
        const contract = new web3.eth.Contract(BfcStakingABI, contractAddress);

        const result = await contract.methods
          .candidate_top_nominations(address_id)
          .call();

        console.log(result);
        setOutputData(result); // Store the result in state
      }
    }

    getNominatorList("0x6bef93e6d6bc1e02b9d697b4fb8606152c200b29");
  }, [web3]);

  return (
    <div className="App">
      <h1>MetaMask Connection Test</h1>
      {web3 ? (
        <div>
          <p>Connected Network: {web3.currentProvider.networkVersion}</p>
          <p>Connected Account: {accounts.join(", ")}</p>
        </div>
      ) : (
        <p>Please install and connect MetaMask.</p>
      )}
    </div>
  );
}
