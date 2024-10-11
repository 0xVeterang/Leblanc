import { Metadata } from "next";
import Navigation from "../components/navigation";
import { ChakraProvider, Container } from "@chakra-ui/react";
import "../styles/global.css"; // 글로벌 CSS 파일 임포트

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Loading...",
  },
  description: "Project LeBlanc",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <Navigation />
          <Container maxW="container.xl" py={4}>
            {children}
          </Container>
        </ChakraProvider>
      </body>
    </html>
  );
}
