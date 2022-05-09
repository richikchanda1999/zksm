import { Flex, Button } from '@chakra-ui/react';
import React from 'react';

function GameCard({
  outerContainerRadius,
  stopGame,
  maxQuestionCount,
  maxTimeLimitInSeconds,
}) {
  React.useEffect(() => {
    console.log('Max Question count: ', maxQuestionCount);
    console.log('Max Time Limit: ', maxTimeLimitInSeconds);
  }, []);

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
      />
      <Flex
        w="30%"
        h="100%"
        bg="#f7dcbb"
        position="absolute"
        right={0}
        borderTopRightRadius={outerContainerRadius}
        borderBottomRightRadius={outerContainerRadius}
      />
      <Button
        w="100px"
        h="100px"
        left="65%"
        top="45%"
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
