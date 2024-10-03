import { Metadata } from "next";
import Navigation from "../components/navigation";
import { ChakraProvider, Container } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: {
    template: "%s | Cool ",
    default: "Loading...",
  },
  description: "What is this project?",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <Container maxW="container.lg" py={4}>
            <Navigation />
            {children}
          </Container>
        </ChakraProvider>
      </body>
    </html>
  );
}
