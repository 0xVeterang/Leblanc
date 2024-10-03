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
} from "@chakra-ui/react";
import ConnectWallet from "./connect-wallet";

export default function Navigation() {
  const path = usePathname();
  return (
    <Box as="nav" bg="gray.100" p={4} borderRadius="md">
      <Container
        maxW="container.lg"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* 로고를 위한 박스 */}
        <Box fontWeight="bold" fontSize="lg">
          <Link href="/">My Logo</Link>
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
                Home {path === "/" ? "🔥" : ""}
              </Box>
            </Link>
          </ListItem>

          <ListItem>
            <Link href="/about-us">
              <Box
                p={2}
                borderRadius="md"
                bg={path === "/about-us" ? "blue.500" : "transparent"}
                color={path === "/about-us" ? "white" : "black"}
              >
                About Us {path === "/about-us" ? "🔥" : ""}
              </Box>
            </Link>
          </ListItem>

          <ListItem>
            <Box p={2} borderRadius="md" bg="blue.500" color="black">
              <ConnectWallet />
            </Box>
          </ListItem>
        </UnorderedList>
      </Container>
    </Box>
  );
}
