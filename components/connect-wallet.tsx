// components/ConnectWallet.tsx

"use client"; // Next.js에서 클라이언트 사이드에서만 동작하게 하기 위한 설정
import { useState, useEffect } from "react";
import Web3 from "web3";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Image from "next/image"; // Next.js의 Image 컴포넌트 사용

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
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        ConnectWallet
      </MenuButton>
      <MenuList>
        <MenuItem onClick={connectWallet}>
          <Image
            src="/resources/img/icon-metamask.svg" // 이미지 경로
            alt="Metamask Icon"
            width={24} // 아이콘의 너비
            height={24} // 아이콘의 높이
            style={{ marginRight: "8px" }} // 텍스트와의 간격 조정
          />
          Metamask
        </MenuItem>
        <MenuItem>
          <Image
            src="/resources/img/icon-pockie.svg" // 이미지 경로
            alt="Metamask Icon"
            width={24} // 아이콘의 너비
            height={24} // 아이콘의 높이
            style={{ marginRight: "8px" }} // 텍스트와의 간격 조정
          />
          Pockie
        </MenuItem>
      </MenuList>
    </Menu>
  );
  /*
  return (
    <div>
      {account ? (
        <p>Connected Wallet: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
  */
}
