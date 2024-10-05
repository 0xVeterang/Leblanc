"use client";
import Web3 from "web3";
import Link from "next/link";
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

interface EthereumWindow extends Window {
  ethereum?: any;
}
// `candidate_state`의 components에서 `name` 추출
const extractColumnNames = () => {
  const abiItem = BfcStakingABI.find((item) => item.name === "candidate_state");

  if (!abiItem || !abiItem.outputs || !abiItem.outputs[0].components) {
    return [];
  }

  return abiItem.outputs[0].components.map((component: any) => component.name);
};

// 추출된 column 이름 사용
const columnLabels = extractColumnNames();

declare let window: EthereumWindow;

function handleBigInt(obj: any) {
  if (typeof obj === "bigint") {
    // BigInt를 문자열로 변환하고 뒤에서 18자리 삭제
    const bigIntStr = obj.toString();
    const shortenedStr =
      bigIntStr.length > 18 ? bigIntStr.slice(0, -18) : bigIntStr; // 마지막 18자리 제거
    return shortenedStr || "0"; // 만약 제거한 결과가 빈 문자열이면 0을 반환
  } else if (Array.isArray(obj)) {
    return obj.map(handleBigInt);
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
      {web3 ? (
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Index</Th>
                    {columnLabels.map((label, index) => (
                      <Th key={index}>{label}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {Array.isArray(outputData[0]) &&
                    outputData[0].map((_, rowIndex: number) => (
                      <Tr key={rowIndex}>
                        <Td>{rowIndex + 1}</Td>
                        {[...Array(20)].map((_, colIndex) => (
                          <Td key={colIndex}>
                            {colIndex === 0 ? (
                              <Link
                                href={`/nominator/${outputData[colIndex][rowIndex]}`}
                              >
                                {outputData[colIndex][rowIndex]
                                  ? outputData[colIndex][rowIndex].toString()
                                  : "-"}
                              </Link>
                            ) : outputData[colIndex] &&
                              outputData[colIndex][rowIndex] ? (
                              outputData[colIndex][rowIndex].toString()
                            ) : (
                              "-"
                            )}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </div>
      ) : (
        <p>Please install and connect MetaMask.</p>
      )}
    </div>
  );
}
