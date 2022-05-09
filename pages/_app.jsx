import { ChakraProvider } from '@chakra-ui/react';
import { Provider, createClient } from 'wagmi';
import React from 'react';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { providers } from 'ethers';
import theme from '../theme';

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors() {
    return [new InjectedConnector()];
  },
  provider() {
    return new providers.JsonRpcProvider('https://api.s0.b.hmny.io/');
  },
});

// eslint-disable-next-line react/prop-types
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
