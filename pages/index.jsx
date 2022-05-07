import {
  Button, Flex, Input, Text,
} from '@chakra-ui/react';
import React from 'react';
import {
  useAccount,
  useConnect,
  useContract,
  useProvider,
  useSigner,
  useDisconnect,
} from 'wagmi';
import { useTimer } from 'react-timer-hook';
import { addCalldata, multiplyCalldata } from '../utils/zk';
import addresses from '../utils/addresses.json';
import addVerifierABI from '../utils/ABIs/AddVerifier.json';
import multiplyVerifierABI from '../utils/ABIs/MultiplyVerifier.json';

function Home() {
  const [a, setA] = React.useState(-1);
  const [b, setB] = React.useState(-1);
  const [c, setC] = React.useState(-1);
  const [op, setOp] = React.useState('');

  const MIN = 2;
  const MAX = 20;
  const OP = ['+', '-', '*', '/'];
  const generate = async () => {
    const temp = (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN) % 4;
    setOp(OP[temp]);

    const x = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    const y = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

    switch (OP[temp]) {
      case '-':
        setA(Math.max(x, y));
        setB(Math.min(x, y));
        break;

      case '/':
        setA(x * y);
        setB(x);
        break;

      default:
        setA(x);
        setB(y);
        break;
    }
  };

  React.useEffect(() => {
    generate();
  }, []);

  const { connectAsync, connectors } = useConnect();
  const {
    data: accountData,
    // isError: accountError,
    // isLoading: accountLoading,
  } = useAccount();
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = React.useState(false);

  const { data: signerData } = useSigner();

  const provider = useProvider();

  const addContract = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addVerifierABI,
    signerOrProvider: signerData || provider,
  });

  const multiplyContract = useContract({
    addressOrName: addresses.multiplyContract,
    contractInterface: multiplyVerifierABI,
    signerOrProvider: signerData || provider,
  });

  const [solved, setSolved] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const [expiryTimestamp] = React.useState(0);
  const {
    seconds, pause, resume, restart, stop,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      stop();
      setIsCompleted(true);
    },
  });

  const submit = async () => {
    pause();
    setLoading(true);
    let calldata;
    switch (op) {
      case '+':
        calldata = await addCalldata(a, b, c);
        break;

      case '-':
        calldata = await addCalldata(b, c, a);
        break;

      case '*':
        calldata = await multiplyCalldata(a, b, c);
        break;

      case '/':
        calldata = await multiplyCalldata(b, c, a);
        break;

      default:
        break;
    }

    if (calldata) {
      console.log(calldata);
      let result;
      if (op === '+' || op === '-') {
        console.log('At add!');
        result = await addContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3],
        );
      } else if (op === '*' || op === '/') {
        console.log('At multiply!');
        result = await multiplyContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3],
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
    setC('');
    generate();
  };

  return (
    <Flex direction="column" align="center" justify="center" w="100%" h="100vh">
      {!accountData && (
        <Text
          maxW="35%"
          fontSize="28px"
          lineHeight="40px"
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
          bg: 'gray.100',
        }}
        mb={accountData ? 10 : 0}
        onClick={async () => {
          if (accountData) disconnect();
          else {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 60);
            await connectAsync(connectors[0]);
            restart(time);
            setIsCompleted(false);
            setSolved(0);
            setTotal(0);
            setC('');
          }
        }}
      >
        {accountData ? 'Disonnect' : 'Connect'}
      </Button>
      {accountData && (
        <Flex direction="column" align="center">
          {isCompleted && (
            <Text>
              You scored
              {' '}
              {solved}
              {' '}
              /
              {' '}
              {total}
              {' '}
              problems! Wohooo!
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
                bg: 'gray.100',
              }}
              mt={10}
              onClick={() => {
                const time = new Date();
                time.setSeconds(time.getSeconds() + 10);
                setIsCompleted(false);
                setSolved(0);
                setTotal(0);
                setC('');
                restart(time);
              }}
            >
              Restart
            </Button>
          )}
          {!isCompleted && (
            <Flex direction="row" justify="center" align="center">
              <Text>
                {a}
                {' '}
                {op}
                {' '}
                {b}
                {' '}
                =
                {' '}
              </Text>
              <Input
                textAlign="center"
                ml={2}
                w="80px"
                value={c === -1 ? '' : c}
                onChange={(v) => {
                  setC(parseInt(v.target.value, 10));
                }}
                type="number"
              />
              <Button ml={2} onClick={submit} disabled={loading}>
                Check!
              </Button>
            </Flex>
          )}
        </Flex>
      )}
      <Flex direction="row" align="center" mt={4}>
        {accountData && !isCompleted && (
        <Text>
          {seconds}
          {' '}
          seconds left!
        </Text>
        )}
        {accountData && !isCompleted && (
          <Text ml={10}>
            Score:
            {' '}
            {solved}
            {' '}
            /
            {' '}
            {total}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

export default Home;
