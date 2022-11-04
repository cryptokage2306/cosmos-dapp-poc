## CUDOS Dapp

### Mutlisend app(POC)
TechStack:-  Cosmjs, React, typescript
- '/'
    -> Use CUDOS native multisend module to send native tokens across multiple users in a single transaction
- '/send' - Send Page
    -> Normal Send of native tokens in CUDOS blockchain
- '/nft' -> Read Native NFT module of CUDOS blockchain
    -> all the query functions
- '/nft/write' -> write on Native NFT module on CUDOS blockchain
    -> all the write functions
- '/nft/all'
    -> View All NFTs present in native module

### React tic tac toe
TechStack:-  Cosmjs, React, javascript
GUI app connected to smart contract on CUDOS testnet on which you can play tic tac toe by putting some CUDOS as a bet
- "/": Home page where you can create a game and you become player 1
- "/join-game": Join the game by looking into list of gameId which are not joined by another Player
- "/join-game/:id": Directly join you to the game as a second player if game is not completed and not joined by any other player 2.
- "/game": List all the games ever played in the smart contract
- "/game/:id": View the game in realtime if it is on going
