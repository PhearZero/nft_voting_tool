# ℹ️ Overview

[xgov.algorand.foundation](https://xgov.algorand.foundation/) is a dapp built with the following technologies:

- Node.js / TypeScript
  - [Vite](https://vitejs.dev/) (UI)
  - [React](https://reactjs.org/) (UI)
  - [tsoa](https://github.com/lukeautry/tsoa) (API)
  - [AWS CDK](https://aws.amazon.com/cdk/)  (Infrastructure)
- Python
  - [algokit](https://developer.algorand.org/docs/get-started/algokit/) (Infrastructure, Libraries)
  - [beaker](https://algorand-devrel.github.io/beaker/html/index.html) (Smart Contract)

# ⚙️ Getting Started

Clone the repository, bootstrap then run the backend and frontend.

```shell
git clone git@github.com:algorandfoundation/nft_voting_tool.git
cd nft_voting_tool
algokit bootstrap all
```

### IPFS Backend

Create a key from [web3.storage](https://web3.storage/tokens/) and add it to the `./src/voting-metadata-api/.env` file
```shell
#.env
NODE_ENV=development
ALLOWED_ADDRESSES=any
API_BINARY_CONTENT_TYPES=image/*
WEB3_STORAGE_API_TOKEN=<your token>
```
Run the Backend
```shell
cd ./src/voting-metadata-api
npm run dev
```

### React Frontend
Run the Vite/React Frontend
```shell
cd ./src/xgov-dapp
npm run dev
```

### *Compile Smart Contracts
Only needed if the contract changes, the artifacts are allready commited to the repository
```shell
cd ./src/algorand
python -m smart_contracts
```

# 📁 Project Structure

## [./src/xgov-dapp/package.json](https://github.com/algorandfoundation/nft_voting_tool/blob/main/src/xgov-dapp/package.json) (Frontend)

This is the primary frontend, a vite SPA with React.
All `react-router` routes are defined in `./src/main.tsx` and the components are found
in the `./src/features/*` folder.

It uses the form `./src/features/vote-creation/RoundInfo.tsx` to create a voting round

### [RoundInfo Form](https://github.com/algorandfoundation/nft_voting_tool/blob/main/src/xgov-dapp/src/features/vote-creation/RoundInfo.tsx)
Requires two CSV uploads, one for the proposals and one for the allowed governors.

Proposals csv is created using the xgov proposals [csv_generator.sh](https://github.com/algorandfoundation/xGov/blob/main/csv_generator.sh)
or by hand with the following structure

```csv
title,description,link,category,focus_area,threshold,ask
xGov Handoff,Handing off xGov,http://linkforfrontend/,Test,Onboarding,20000,10
```

The allowed governors csv uses the following structure:

```csv
address,weight
HIPIRKMX7O3SJNDI4NSB3LRNHV26TVS7HDBJ7GG3IPX2JHCYZBCHSNDMMQ,1
```


## ~~./src/dapp/package.json~~ (Deprecated)

Abandoned project with 4 remaining dependencies, these files are used in `./src/xgov-dapp` and can be safely migrated to `./src/xgov-dapp/src/shared/*`:

- `./src/dapp/shared/csvSigner.ts`
- `./src/dapp/shared/IPFSGateway.ts`
- `./src/dapp/shared/VotingRoundContract.ts`

The `./src/dapp/shared/types.ts` file has to be merged with `./src/xgov-dapp/src/types`.

## [./src/algorand/smart_contract/package.json](https://github.com/algorandfoundation/nft_voting_tool/blob/main/src/algorand/smart_contracts/package.json)

Just deployments for the smart contract using Node.js, the frontend builds the client dynamically from
the `application.json` artifact in development.

## [./src/voting-metadata-api/package.json](https://github.com/algorandfoundation/nft_voting_tool/blob/main/src/voting-metadata-api/package.json) (Backend)

This is the IPFS backend. It's a simple Node.js server that servers ipfs content with a cache

## [./infrastructure/package.json](https://github.com/algorandfoundation/nft_voting_tool/blob/main/infrastructure/package.json)

AWS CDK project for deploying the project to Amazon.


## [./src/algorand/smart_contracts/](https://github.com/algorandfoundation/nft_voting_tool/tree/main/src/algorand/smart_contracts) (Smart Contract)

Python module that builds the Beaker Smart Contracts into [artifacts](https://github.com/algorandfoundation/nft_voting_tool/tree/main/src/algorand/smart_contracts/artifacts/VotingRoundApp).
The `application.json` artifact is loaded by the React frontend.

## [./src/algorand/smart_contracts/voting.py](https://github.com/algorandfoundation/nft_voting_tool/blob/main/src/algorand/smart_contracts/voting.py)
The Beaker Smart Contract for Voting

## [./src/algorand/smart_contracts/op_up.py](https://github.com/algorandfoundation/nft_voting_tool/blob/main/src/algorand/smart_contracts/op_up.py)
The Beaker Smart Contract for increasing the ops code budget for an application
