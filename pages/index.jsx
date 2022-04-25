import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React from "react";
import { addCalldata, multiplyCalldata } from "../utils/zk";
import addresses from "../utils/addresses.json";
import addAbi from "../utils/abis/AddVerifier.json";
import multiplyAbi from "../utils/abis/MultiplyVerifier.json";
import {
  useAccount,
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useNetwork,
  useDisconnect,
} from "wagmi";

function Home() {
  const [a, setA] = React.useState(-1);
  const [b, setB] = React.useState(-1);
  const [c, setC] = React.useState(-1);
  const [op, setOp] = React.useState("");

  const [shouldShow, setShouldShow] = React.useState(false);

  const MIN = 2;
  const MAX = 20;
  const OP = ["+", "-", "*", "/"];
  const generate = async () => {
    const temp = (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN) % 4;
    setOp(OP[temp]);

    const a = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    const b = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    switch (OP[temp]) {
      case "+":
      case "*":
        setA(a);
        setB(b);
        break;

      case "-":
        setA(Math.max(a, b));
        setB(Math.min(a, b));
        break;

      case "/":
        setA(a * b);
        setB(a);
        break;
    }
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
    let calldata;
    switch (op) {
      case "+":
        calldata = await addCalldata(a, b, c);
        break;

      case "-":
        calldata = await addCalldata(b, c, a);
        break;

      case "*":
        calldata = await multiplyCalldata(a, b, c);
        break;

      case "/":
        calldata = await multiplyCalldata(b, c, a);
        break;
    }

    if (calldata) {
      let result;
      if (op === "+" || op === "-") {
        console.log('At add!');
        result = await addContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3]
        );
      } else if (op === "*" || op === "/") {
        console.log('At multiply!');
        result = await multiplyContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3]
        );
      }

      console.log('RESULT: ', result);

      if (result) {
        setC("");
        generate();
      }
    }
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

  const addContract = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addAbi,
    signerOrProvider: signerData || provider,
  });

  const addContractNoSigner = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addAbi,
    signerOrProvider: provider,
  });

  const multiplyContract = useContract({
    addressOrName: addresses.multiplyContract,
    contractInterface: multiplyAbi,
    signerOrProvider: signerData || provider,
  });

  const multiplyContractNoSigner = useContract({
    addressOrName: addresses.multiplyContract,
    contractInterface: multiplyAbi,
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
              value={c === -1 ? "" : c}
              onChange={(v) => {
                try {
                  setC(parseInt(v.target.value));
                } catch (err) {}
              }}
              type="number"
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
