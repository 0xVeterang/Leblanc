"use client";
import Web3 from "web3";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loading from "./loading";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import BfcStakingABI from "../abi/bfc_staking.json";

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

// 주소를 포맷팅하는 함수 추가
const formatAddress = (address: string) => {
  if (address.length > 10) {
    return address.slice(0, 6) + "...." + address.slice(-4);
  }
  return address;
};

// ERY 계산 함수
const calculateERY = (
  selfStaking: string,
  nominatedAmount: string,
  commision: string
) => {
  // 문자열을 숫자로 변환
  const selfStakingNumber = Number(selfStaking);
  const nominatedAmountNumber = Number(nominatedAmount);
  const commisionNumber = Number(commision);

  // Total Stake 계산
  const totalStaked = selfStakingNumber + nominatedAmountNumber;

  // 수수료 반영
  const commissionFactor = 1 - commisionNumber / 100;

  // 전체 보상률 가정 (이 값은 계산한 방식에 따라 변경될 수 있음)
  const totalRewardRate = 0.1; // 가정된 보상률, 10%로 설정

  // ERY 계산
  const ery = commissionFactor * (totalRewardRate / totalStaked) * totalStaked;

  // 결과를 소수점 둘째 자리까지 반환
  return (ery * 100).toFixed(2);
};

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
            <Loading />
          ) : (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Index</Th>
                    <Th>Tier</Th>
                    <Th>Candidate</Th>
                    <Th>Voting Power</Th>
                    <Th>Nomination Count</Th>
                    <Th>Commission</Th>
                    <Th>Awarded Tokens</Th>
                    <Th>ERY</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Array.isArray(outputData[0]) &&
                    outputData[0].map((_, rowIndex: number) => (
                      <Tr key={rowIndex}>
                        <Td>{rowIndex + 1}</Td>
                        {/* tier */}
                        <Td>
                          {outputData[19] && outputData[19][rowIndex] == 1
                            ? "Basic"
                            : "Full"}
                        </Td>
                        {/* candidate */}
                        <Td>
                          <Tooltip
                            label={`${outputData[0][rowIndex]}`}
                            fontSize="md"
                            placement="top"
                          >
                            <Link
                              href={`/nominator/${outputData[0][rowIndex]}`}
                              passHref
                            >
                              <Text
                                as="span"
                                cursor="pointer"
                                textDecoration="underline"
                              >
                                {formatAddress(
                                  outputData[0][rowIndex].toString()
                                )}
                              </Text>
                            </Link>
                          </Tooltip>
                        </Td>
                        {/* Voting Power (Voting Power - Bond) */}
                        <Td>
                          <Tooltip
                            label={
                              <div>
                                <Text>Validator’s self-staking amount: </Text>
                                <Text>
                                  {(
                                    (outputData[2][rowIndex] /
                                      outputData[5][rowIndex]) *
                                    100
                                  ).toFixed(2)}
                                  % (
                                  {Number(
                                    outputData[2][rowIndex]
                                  ).toLocaleString()}{" "}
                                  BFC)
                                </Text>
                                <Text>Nominated amount: </Text>
                                <Text>
                                  {(
                                    ((outputData[5][rowIndex] -
                                      outputData[2][rowIndex]) /
                                      outputData[5][rowIndex]) *
                                    100
                                  ).toFixed(2)}
                                  % (
                                  {Number(
                                    outputData[5][rowIndex] -
                                      outputData[2][rowIndex]
                                  ).toLocaleString()}{" "}
                                  BFC)
                                </Text>
                              </div>
                            }
                            fontSize="md"
                            placement="top"
                          >
                            {/* 기본 Voting Power 표시 */}
                            {Number(outputData[5][rowIndex]).toLocaleString()}
                          </Tooltip>
                          BFC
                        </Td>
                        {/* nomination_count */}
                        <Td>{outputData[4][rowIndex]}</Td>
                        {/* commission */}
                        <Td>{outputData[13][rowIndex] / 10000000}%</Td>

                        {/* awarded_tokens */}
                        <Td>{outputData[18][rowIndex]}</Td>

                        {/* ERY 계산 및 출력 */}
                        <Td>
                          {/*calculateERY(
                            outputData[2][rowIndex],
                            outputData[5][rowIndex] - outputData[2][rowIndex],
                            outputData[13][rowIndex] / 10000000
                          )*/}
                          ???
                        </Td>
                      </Tr>
                    ))}
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
