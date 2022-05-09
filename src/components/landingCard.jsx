import { Flex, Button, Text } from '@chakra-ui/react';
import React from 'react';

function LandingCard({
  outerContainerRadius,
  startGame,
  maxQuestionCount,
  maxTimeLimitInSeconds,
}) {
  const rules = [
    `1. You will have to solve a total of ${maxQuestionCount} math problems`,
    `2. You will be given a total of ${maxTimeLimitInSeconds} seconds to solve them`,
    '3. Goodluck!',
  ];

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
        <Text
          letterSpacing={1}
          textAlign="center"
          fontWeight="700"
          fontSize="48px"
        >
          ZKSM
        </Text>
        <Text textAlign="center" fontSize="24px">
          The Zero Knowledge way of playing Speed Math
        </Text>
        <Flex
          w="60%"
          h="30%"
          mt={8}
          border="1px solid #99704e"
          borderRadius={outerContainerRadius}
          direction="column"
          justify="center"
          align="start"
          p={4}
        >
          <Text fontWeight="700">Rules:</Text>
          {rules.map((rule) => (
            <Text mt={2} key={rule}>
              {rule}
            </Text>
          ))}
        </Flex>
      </Flex>
      <Flex
        w="30%"
        h="100%"
        bg="#c3c6b1"
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
        onClick={startGame}
        bg="white"
        boxShadow="0px 2px 2px 2px #00aa84"
        _hover={{
          boxShadow: '0px 1px 1px 1px #00aa84',
          fontStyle: 'bold',
          fontWeight: '700',
          fontSize: '16.5px',
        }}
        fontWeight="700"
        color="#00aa84"
      >
        Start
      </Button>
    </Flex>
  );
}

export default LandingCard;
