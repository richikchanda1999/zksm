import {
  Flex, Button, Text, Input, useToast,
  ToastPositionWithLogical,
} from '@chakra-ui/react';
import { useContract, useProvider } from 'wagmi';
import React from 'react';
import { useTimer } from 'react-timer-hook';
import { addCalldata, multiplyCalldata } from '../../utils/zk';
import addresses from '../../utils/addresses.json';
import addAbi from '../../utils/ABIs/AddVerifier.json';
import multiplyAbi from '../../utils/ABIs/MultiplyVerifier.json';

function GameCard({
  outerContainerRadius,
  stopGame,
  maxQuestionCount,
  maxTimeLimitInSeconds,
  expiryTimestamp,
}) {
  const [a, setA] = React.useState(-1);
  const [b, setB] = React.useState(-1);
  const [c, setC] = React.useState('');
  const [op, setOp] = React.useState('');

  const MIN = 2;
  const MAX = 20;
  const OP = ['+', '-', 'x', '/'];
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

  const [loading, setLoading] = React.useState(false);

  const provider = useProvider();

  const addContract = useContract({
    addressOrName: addresses.addContract,
    contractInterface: addAbi,
    signerOrProvider: provider,
  });

  const multiplyContract = useContract({
    addressOrName: addresses.multiplyContract,
    contractInterface: multiplyAbi,
    signerOrProvider: provider,
  });

  const [isCompleted, setIsCompleted] = React.useState(false);
  const [quesResult, setQuesResult] = React.useState(false);
  const {
    seconds, pause, resume, restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      setIsCompleted(true);
    },
  });

  const [solved, setSolved] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + maxTimeLimitInSeconds);
    restart(time);
    setIsCompleted(false);
    setSolved(0);
    setTotal(0);
    setC('');
    generate();
  }, []);

  const toast = useToast();

  React.useEffect(() => {
    if (total === maxQuestionCount || isCompleted) {
      stopGame();
      if (solved === maxQuestionCount) {
        toast({
          position: 'top',
          title: 'Correct Answer!',
          description: 'You have solved all the questions!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (total > 0) {
        toast({
          position: 'top',
          title: 'Alas!',
          description: "You didn't solve all the questions!",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [total, isCompleted]);

  const getNumberCard = (number) => (
    <Flex
      align="center"
      justify="center"
      h="80px"
      w="80px"
      borderRadius="8px"
      boxShadow="0px 2px 2px 2px #bf8f72"
    >
      <Text fontSize="24px" fontWeight="700" color="#99704e" textAlign="center">
        {number}
      </Text>
    </Flex>
  );

  const getOperatorCard = (operator) => (
    <Text
      fontSize="24px"
      borderRadius="50%"
      w="50px"
      h="50px"
      boxShadow="0px 2px 2px 2px #bf8f72"
      fontWeight="700"
      color="#99704e"
      mx={6}
      textAlign="center"
      py={2}
    >
      {operator}
    </Text>
  );

  const onSubmit = async () => {
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

      case 'x':
        calldata = await multiplyCalldata(a, b, c);
        break;

      default:
        calldata = await multiplyCalldata(b, c, a);
        break;
    }

    if (calldata) {
      let result;
      if (op === '+' || op === '-') {
        result = await addContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3],
        );
      } else if (op === 'x' || op === '/') {
        result = await multiplyContract.verifyProof(
          calldata[0],
          calldata[1],
          calldata[2],
          calldata[3],
        );
      }

      setQuesResult(result);

      if (result) {
        setSolved(solved + 1);
      }
    } else setQuesResult(false);
    setTotal(total + 1);
    setLoading(false);
    resume();
    setC('');
    generate();
  };

  return (
    <Flex
      bg="#fef9f3"
      w="65%"
      h="65%"
      borderRadius={outerContainerRadius}
      position="relative"
    >
      <Flex
        w="70%"
        h="100%"
        borderTopLeftRadius={outerContainerRadius}
        borderBottomLeftRadius={outerContainerRadius}
        direction="column"
        justify="center"
        align="center"
        position="absolute"
        left={0}
      >
        <Flex direction="row" align="center">
          {getNumberCard(a)}
          {getOperatorCard(op)}
          {getNumberCard(b)}
          {getOperatorCard('=')}
          <Flex
            align="center"
            justify="center"
            h="80px"
            w="80px"
            borderRadius="8px"
            boxShadow="0px 2px 2px 2px #bf8f72"
          >
            <Input
              h="100%"
              fontSize="24px"
              fontWeight="700"
              color="#99704e"
              textAlign="center"
              type="number"
              _focus={{}}
              value={c}
              onChange={(e) => setC(parseInt(e.target.value, 10))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmit();
              }}
              disabled={loading}
            />
          </Flex>
        </Flex>
        <Button
          disabled={loading}
          mt={8}
          onClick={onSubmit}
          border="2px solid #99704e"
          bg="#fef9f3"
          _active={{}}
          _focus={{}}
          _hover={{
            boxShadow: '0px 1px 1px 1px #99704e',
          }}
          color="#99704e"
        >
          Check
        </Button>
      </Flex>
      <Flex
        w="30%"
        h="100%"
        bg="#f7dcbb"
        position="absolute"
        direction="column"
        right={0}
        borderTopRightRadius={outerContainerRadius}
        borderBottomRightRadius={outerContainerRadius}
        justify="center"
      >
        <Text
          textAlign="center"
          fontSize="24px"
          fontWeight="700"
          ml={2}
          color="#99704e"
        >
          {seconds}
          {' '}
          seconds left
        </Text>
        <Text
          textAlign="center"
          fontSize="24px"
          fontWeight="700"
          ml={2}
          color="#99704e"
        >
          {maxQuestionCount - total}
          {' '}
          questions left
        </Text>
        <Text
          textAlign="center"
          fontSize="24px"
          fontWeight="700"
          color={quesResult ? '#00aa84' : total === 0 ? 'black' : '#f06c64'}
          ml={2}
        >
          Score:
          {' '}
          {solved}
          {' / '}
          {maxQuestionCount}
          {' '}
        </Text>
      </Flex>
      <Button
        w="100px"
        h="100px"
        left="65%"
        top="calc(50% - 50px)"
        position="absolute"
        borderRadius="50%"
        onClick={stopGame}
        bg="white"
        boxShadow="0px 2px 2px 2px #f06c64"
        _hover={{
          boxShadow: '0px 1px 1px 1px #f06c64',
          fontStyle: 'bold',
          fontWeight: '700',
          fontSize: '16.5px',
        }}
        color="#f06c64"
      >
        Stop
      </Button>
    </Flex>
  );
}

export default GameCard;
