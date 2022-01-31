# MultiSend Dapp

## Prerequisite
- Your browser have [keplr wallet](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en) extension
- Keplr wallet must contain [cudos-public-testnet network](https://docs.cudos.org/build/account-setup.html#link-keplr-to-the-cudos-network).
- Use [faucet](https://explorer.cudos.org/faucet) to send some cudos token to wallet address

## Setup
- git clone [cudos-dapp](https://github.com/CudoVentures/cudos-dapps.git)
- node version > v14
```sh
cd multi-send
nvm use #install node version 14
yarn #install all dependencies
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Know about Pages
It has two pages which contain following things
- */* : this is the homepage and contains multisend feature
- */send* : this is the second page and contains send feature 

## MultiSend (/)
### Features
- Can send Tokens to multiple addresses at once
- Saves gas cost as only one transaction is needed instead of n transactions.

## How to do MultiSend?
- Add address of recipient and number of cudos tokens sender wants to send. (Make sure you have enough balance to carry out transaction)
- If you want to add more than 1 receiving address click on [+/-] button present above to increase or decrease number of sender

## Send (/send)
### Features
- Can send Tokens to single address and takes 1 transactions

## How to do Send?
- Add address of recipient and number of cudos tokens sender wants to send. (Make sure you have enough balance to carry out transaction)