// components/Loading.tsx
import React from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="rgba(0, 0, 0, 0.7)" // 반투명한 배경
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="9999"
      backdropFilter="blur(5px)" // 배경 블러 효과 추가
    >
      <Spinner
        size="xl"
        color="orange.500"
        thickness="4px" // 두께 조정
        emptyColor="gray.200" // 빈 색상
        speed="0.8s" // 애니메이션 속도
      />
      <Text
        mt={4}
        fontSize="lg"
        color="white"
        fontWeight="bold"
        animation="fadeIn 0.5s ease-in-out" // 텍스트 애니메이션
        style={{
          animation: "fadeIn 0.5s ease-in-out", // CSS 애니메이션
        }}
      >
        Loading...
      </Text>

      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Flex>
  );
};

export default Loading;
