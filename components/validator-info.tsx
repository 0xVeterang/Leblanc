"use client";
import Web3 from "web3";
import { useState, useEffect } from "react";
import BfcStakingABI from "../abi/bfc_staking.json";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare let window: EthereumWindow;

// BigInt를 문자열로 변환하는 함수
function handleBigInt(obj: any) {
  if (typeof obj === "bigint") {
    return obj.toString(); // BigInt를 문자열로 변환
  } else if (Array.isArray(obj)) {
    return obj.map(handleBigInt); // 배열일 경우 재귀적으로 처리
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, handleBigInt(value)])
    );
  }
  return obj;
}

export default function ValidatorInfo() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [outputData, setOutputData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          console.error("Error fetching accounts:", error);
        }
      } else {
        console.log("Please install MetaMask.");
      }
    }

    loadWeb3();
  }, []);

  useEffect(() => {
    async function getAllValidatorList(tier: string) {
      if (web3) {
        setIsLoading(true);
        try {
          const contractAddress = "0x0000000000000000000000000000000000000400";
          const contract = new web3.eth.Contract(
            BfcStakingABI,
            contractAddress
          );

          const result = await contract.methods.candidate_states(tier).call();
          console.log("Raw Result: ", result);

          // BigInt 변환 후 저장
          const processedResult = handleBigInt(result);
          console.log("Processed Result: ", processedResult);
          setOutputData(processedResult);
        } catch (error) {
          console.error("Error fetching validator list:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (web3) {
      getAllValidatorList("0");
    }
  }, [web3]);

  return (
    <div>
      <h1>MetaMask Connection Test</h1>
      {web3 ? (
        <div>
          <p>Connected Account: {accounts.join(", ")}</p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {Object.keys(outputData).length > 0 ? (
                Object.keys(outputData).map((key: string) => (
                  <div key={key}>
                    <h3>Array {key}</h3>
                    {Array.isArray(outputData[key]) ? (
                      outputData[key].map(
                        (innerData: any, innerIndex: number) => (
                          <p key={innerIndex}>{JSON.stringify(innerData)}</p>
                        )
                      )
                    ) : (
                      <p>No data available for key {key}</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Please install and connect MetaMask.</p>
      )}
    </div>
  );
}
