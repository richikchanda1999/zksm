import { Flex } from '@chakra-ui/react';
import React from 'react';
import GameCard from '../src/components/gameCard';
import LandingCard from '../src/components/landingCard';

function IndexPage() {
  const [gameStarted, setGameStarted] = React.useState(false);
  const outerContainerRadius = '8px';

  const startGame = () => setGameStarted(true);
  const stopGame = () => setGameStarted(false);

  return (
    <Flex
      w="100%"
      bg="#99704e"
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
        />
      ) : (
        <LandingCard
          outerContainerRadius={outerContainerRadius}
          startGame={startGame}
          maxQuestionCount={10}
          maxTimeLimitInSeconds={15}
        />
      )}
    </Flex>
  );
}

export default IndexPage;
