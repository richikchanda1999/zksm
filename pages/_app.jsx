import { ChakraProvider } from "@chakra-ui/react";
import { Provider, createClient } from "wagmi";
import theme from "../theme";

const client = createClient();

function MyApp({ Component, pageProps }) {
  return (
    <Provider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
