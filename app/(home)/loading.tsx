// app/loading.tsx

import { Spinner, Center } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

export default Loading;
