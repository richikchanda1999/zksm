import { Flex } from '@chakra-ui/react';
import React from 'react';
import GameCard from '../src/components/gameCard';
import LandingCard from '../src/components/landingCard';

function IndexPage() {
  const [gameStarted, setGameStarted] = React.useState(false);
  const outerContainerRadius = '8px';

  const startGame = () => setGameStarted(true);
  const stopGame = () => setGameStarted(false);

  const maxQuestionCount = 10;
  const maxTimeLimitInSeconds = 20;

  return (
    <Flex
      w="100%"
      bg="#bf8f72"
      h="100vh"
      align="center"
      justify="center"
      direction="column"
    >
      {gameStarted ? (
        <GameCard
          outerContainerRadius={outerContainerRadius}
          gameStarted={gameStarted}
          startGame={startGame}
          stopGame={stopGame}
          maxQuestionCount={maxQuestionCount}
          maxTimeLimitInSeconds={maxTimeLimitInSeconds}
        />
      ) : (
        <LandingCard
          outerContainerRadius={outerContainerRadius}
          startGame={startGame}
          maxQuestionCount={maxQuestionCount}
          maxTimeLimitInSeconds={maxTimeLimitInSeconds}
        />
      )}
    </Flex>
  );
}

export default IndexPage;
