import { ChakraProvider } from '@chakra-ui/react';
import { Provider, createClient, defaultChains } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import React from 'react';
import theme from '../theme';

const chains = defaultChains;

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors() {
    return [new MetaMaskConnector({ chains })];
  },
});

// eslint-disable-next-line react/prop-types
function MyApp({ Component, pageProps }) {
  console.log(theme);
  return (
    <Provider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
