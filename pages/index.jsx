import { Button, CircularProgress, Flex, Input, Text } from "@chakra-ui/react";
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
import { useTimer } from "react-timer-hook";

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
    pause();
    setLoading(true);
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
        console.log("At add!");
        result = await addContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3]
        );
      } else if (op === "*" || op === "/") {
        console.log("At multiply!");
        result = await multiplyContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3]
        );
      }

      console.log(result);

      if (result) {
        setSolved(solved + 1);
      }
    }
    setTotal(total + 1);
    setLoading(false);
    resume();
    setC("");
    generate();
  };

  const { connect, connectors } = useConnect();
  const { data: accountData, isError, isLoading } = useAccount();
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = React.useState(false);

  const { data: signerData } = useSigner();

  const provider = useProvider();

  const addContract = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addAbi,
    signerOrProvider: signerData || provider,
  });

  const multiplyContract = useContract({
    addressOrName: addresses.multiplyContract,
    contractInterface: multiplyAbi,
    signerOrProvider: signerData || provider,
  });

  const [expiryTimestamp, setExpiryTimestamp] = React.useState(0);
  const { seconds, pause, resume, restart, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      stop();
      setIsCompleted(true);
    },
  });

  const [solved, setSolved] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);

  return (
    <Flex direction="column" align="center" justify="center" w="100%" h="100vh">
      {!accountData && (
        <Text
          maxW="35%"
          fontSize="28px"
          lineHeight="40px"
          fontWeight="600"
          mb={8}
          textAlign="center"
          letterSpacing={0.5}
        >
          Welcome to Zero Knowledge Speed Math! Connect your wallet to get
          started.
        </Text>
      )}
      <Button
        border="2px solid #000000"
        borderRadius="10px"
        w="200px"
        h="48px"
        bg="#FFFFFF"
        _hover={{
          bg: "gray.100",
        }}
        mb={accountData ? 10 : 0}
        onClick={() => {
          if (accountData) disconnect();
          else {
            connect(connectors[0]);
            const time = new Date();
            time.setSeconds(time.getSeconds() + 10);
            restart(time);
            setIsCompleted(false);
            setSolved(0);
            setTotal(0);
            setC("");
          }
        }}
      >
        {accountData ? "Disonnect" : "Connect"}
      </Button>
      {accountData && (
        <Flex direction="column" align="center">
          {isCompleted && (
            <Text>
              You scored {solved} / {total} problems! Wohooo!
            </Text>
          )}
          {isCompleted && (
            <Button
              border="2px solid #000000"
              borderRadius="10px"
              w="200px"
              h="48px"
              bg="#FFFFFF"
              _hover={{
                bg: "gray.100",
              }}
              mt={10}
              onClick={() => {
                const time = new Date();
                time.setSeconds(time.getSeconds() + 10);
                restart(time);
                setIsCompleted(false);
                setSolved(0);
                setTotal(0);
                setC("");
              }}
            >
              Restart
            </Button>
          )}
          {!isCompleted && (
            <Flex direction="row" justify="center" align="center">
              <Text>
                {a} {op} {b} ={" "}
              </Text>
              <Input
                textAlign="center"
                ml={2}
                w="80px"
                value={c === -1 ? "" : c}
                onChange={(v) => {
                  try {
                    setC(parseInt(v.target.value));
                  } catch (err) {}
                }}
                type="number"
              ></Input>
              <Button ml={2} onClick={submit} disabled={loading}>
                Check!
              </Button>
            </Flex>
          )}
        </Flex>
      )}
      {accountData && !isCompleted && <Text>{seconds} seconds left!</Text>}
    </Flex>
  );
}

export default Home;
