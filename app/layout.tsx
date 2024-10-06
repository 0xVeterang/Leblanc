import { Metadata } from "next";
import Navigation from "../components/navigation";
import { ChakraProvider, Container } from "@chakra-ui/react";

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
