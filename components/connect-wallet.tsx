// components/ConnectWallet.tsx

"use client"; // Next.js에서 클라이언트 사이드에서만 동작하게 하기 위한 설정
import { useState, useEffect } from "react";
import Web3 from "web3";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare let window: EthereumWindow;

export default function ConnectWallet() {
  console.log("ConnectWallet");
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);

  // MetaMask 지갑 연결 함수
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" }); // 지갑 연결 요청
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]); // 첫 번째 계정을 상태로 설정
        setWeb3(web3Instance); // Web3 인스턴스 저장
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("MetaMask extension not detected. Please install MetaMask!");
    }
  };

  // 지갑 연결 상태 확인 함수
  const checkWalletConnection = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setWeb3(web3Instance);
      }
    }
  };

  // 페이지가 처음 로드되었을 때, 지갑 연결 여부 확인
  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <div>
      {account ? (
        <p>Connected Wallet: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
