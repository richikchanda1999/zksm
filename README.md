# Zero Knowledge Speed Math

This is a mental math game where players are presented with simple arithmetic calculations to solve.
The more the player can solve the greater the score they obtain!

## Structure of the Project

The project has mainly three components:

1. Circuits - This part of the project is responsible for the creation of the `circom` circuits. These circuits are at the core of this game and differentiates it from other available games.

2. Contracts - These contracts are generated using `snarkjs` and help verify the zk-proofs on-chain

3. Frontend UI - The frontend UI is responsible for the user interface and the interaction with the user.

## Something more about the circuits

There are two circuits:

1. Addition Circuit - This circuit is responsible for checking if two numbers add up to a third number. It takes three signals as input, `a`, `b` and `c` and checks if `c` == `a` + `b`. It is extended to be used for the case of division. Instead of checking if `a` - `b` == `c`, we check if `b` + `c` == `a`.

2. Multiplication Circuit - This circuit is responsible for checking if the product of two numbers is a third number. It takes three signals as input, `a`, `b` and `c` and checks if `c` == `a` *`b`.
It is extended to be used for the case of division. Instead of checking if `a` / `b` == `c`, we check if `b`* `c` == `a`.

