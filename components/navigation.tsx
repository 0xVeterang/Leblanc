"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  UnorderedList,
  ListItem,
  Container,
  Flex,
  Spacer,
  Text,
  Image,
} from "@chakra-ui/react";
import ConnectWallet from "./connect-wallet";

export default function Navigation() {
  const path = usePathname();
  return (
    <Box as="nav" bg="gray.100" p={4} borderRadius="md">
      <Container
        maxW="container.xl"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* 로고를 위한 박스 */}
        <Box fontWeight="bold" fontSize="lg">
          <Link href="/">
            <Flex alignItems="center">
              {" "}
              {/* Flex 사용으로 수평 정렬 */}
              <Image
                src="/resources/img/icon-logo.svg" // 이미지 경로
                alt="Logo Icon"
                width={12} // 아이콘의 너비
                height={12} // 아이콘의 높이
                style={{ marginRight: "8px" }} // 텍스트와의 간격 조정
              />
              LeBlanc {/* 텍스트를 이미지 오른쪽에 배치 */}
            </Flex>
          </Link>
        </Box>

        {/* 내비게이션 리스트 */}
        <UnorderedList styleType="none" display="flex" gap="2rem" margin={0}>
          <ListItem>
            <Link href="/">
              <Box
                p={2}
                borderRadius="md"
                bg={path === "/" ? "blue.500" : "transparent"}
                color={path === "/" ? "white" : "black"}
              >
                Home
              </Box>
            </Link>
          </ListItem>

          <ListItem>
            <Link href="/bridge">
              <Box
                p={2}
                borderRadius="md"
                bg={path === "/bridge" ? "blue.500" : "transparent"}
                color={path === "/bridge" ? "white" : "black"}
              >
                Bridge
              </Box>
            </Link>
          </ListItem>

          <ListItem>
            <ConnectWallet />
          </ListItem>
        </UnorderedList>
      </Container>
    </Box>
  );
}
