import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";
import { addCalldata } from "../utils/zk";
import addresses from "../utils/addresses.json";
import addAbi from "../utils/abis/Verifier.json";
import {
  useAccount,
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useNetwork,
  useDisconnect,
} from "wagmi";
import { connect } from "@wagmi/core";

function Home() {
  const [a, setA] = React.useState(-1);
  const [b, setB] = React.useState(-1);
  const [c, setC] = React.useState(-1);
  const [op, setOp] = React.useState("");

  const [shouldShow, setShouldShow] = React.useState(false);

  const MIN = 1;
  const MAX = 50;
  const generate = async () => {
    const a = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    const b = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    setA(a);
    setB(b);
    setOp("+");
  };

  React.useEffect(() => {
    generate();
  }, []);

  React.useEffect(() => {
    if (a > 0 && b > 0) {
      setShouldShow(true);
    }
  }, [a, b]);

  const submit = async () => {
    console.log(c);
    const calldata = await addCalldata(2, 5, 7);

    console.log(calldata);
    if (calldata) {
      let result = await contract.verifyProof(
        calldata[0],
        calldata[1],
        calldata[2],
        calldata[3]
      );

      console.log(result);
    }

    // let finalData = await result.wait();
    // console.log(finalData);
  };

  const {
    connect,
    connectors,
    error: connectError,
    isConnecting,
    pendingConnector,
  } = useConnect();
  const { data: accountData, isError, isLoading } = useAccount();
  const { data: networkData, error: networkError, loading } = useNetwork();
  const { disconnect } = useDisconnect();

  // const [loadingVerifyBtn, setLoadingVerifyBtn] = useState(false);
  // const [loadingVerifyAndMintBtn, setLoadingVerifyAndMintBtn] = useState(false);
  // const [loadingStartGameBtn, setLoadingStartGameBtn] = useState(false);

  const {
    data: signerData,
    isError: isSignerError,
    isLoading: isSignerLoading,
  } = useSigner();

  const provider = useProvider();

  const contract = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addAbi,
    signerOrProvider: signerData || provider,
  });

  const contractNoSigner = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addAbi,
    signerOrProvider: provider,
  });

  return (
    <Flex direction="column">
      <Button
        onClick={() => {
          if (accountData) disconnect();
          else {
            connect(connectors[0]);
          }
        }}
      >
        {accountData ? "Disonnect" : "Connect"}
      </Button>
      {accountData && (
        <Flex direction="row" justify="center" align="center">
          {shouldShow && (
            <Text>
              {a} {op} {b} ={" "}
            </Text>
          )}
          {shouldShow && (
            <Input
              textAlign="center"
              ml={2}
              w="60px"
              onChange={(v) => {
                try {
                  setC(parseInt(v.target.value));
                } catch (err) {}
              }}
            ></Input>
          )}
          {shouldShow && (
            <Button ml={2} onClick={submit}>
              Check!
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default Home;
