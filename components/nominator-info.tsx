"use client";
import Web3 from "web3";
import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import BfcStakingABI from "../abi/bfc_staking.json";
import Loading from "./loading";

interface EthereumWindow extends Window {
  ethereum?: any;
}

declare let window: EthereumWindow;

function handleBigInt(obj: any) {
  if (typeof obj === "bigint") {
    const bigIntStr = obj.toString();
    const shortenedStr =
      bigIntStr.length > 18 ? bigIntStr.slice(0, -18) : bigIntStr;
    return shortenedStr || "0";
  } else if (Array.isArray(obj)) {
    return obj.map(handleBigInt);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, handleBigInt(value)])
    );
  }
  return obj;
}

export default function NominatorInfo({
  address_id,
  onDataUpdate, // 부모 컴포넌트에서 전달받은 함수
}: {
  address_id: string;
  onDataUpdate: (data: any) => void; // data를 전달하는 함수 타입 정의
}) {
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
    async function getAllNominatorList(address_id: string) {
      if (web3) {
        setIsLoading(true);
        try {
          const contractAddress = "0x0000000000000000000000000000000000000400";
          const contract = new web3.eth.Contract(
            BfcStakingABI,
            contractAddress
          );

          const result = await contract.methods
            .candidate_top_nominations(address_id)
            .call();
          console.log("Raw Result: ", result);

          if (result && Object.keys(result).length > 0) {
            const processedResult = handleBigInt(result);
            console.log("Processed Result: ", processedResult);
            setOutputData(processedResult);
            onDataUpdate(processedResult); // 부모에게 전달
          } else {
            console.error("Empty result from the contract call");
          }
        } catch (error) {
          console.error("Error fetching validator list:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (web3) {
      getAllNominatorList(address_id);
    }
  }, [web3]);

  return (
    <div>
      {web3 ? (
        <div>
          {isLoading ? (
            <Loading />
          ) : Object.keys(outputData).length === 0 ? (
            <p>No data available</p>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Index</Th>
                    <Th>Nominator</Th>
                    <Th>Nomination</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {outputData.nominators.map(
                    (nominator: string, index: number) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{nominator}</Td>
                        <Td>{outputData.nominations[index]}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
