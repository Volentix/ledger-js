# vlabs-ledger-js

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
TODO: Put more badges here.

> A javascript client library for Volentix Ledger

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Development](#development)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

First add the ledger client to your application:

`npm add vlabs-ledger-js`

You must have access to an EOS instance with the [Volentix Ledger](https://github.io/Volentix/ledger)
contracts deployed. Please see that project for deployment of the contracts.

## Usage

```javascript
import Ledger from "volentix-ledger-js";

const ledger = new Ledger({
  eosNode: "https://url-of-eos-node",                                     // URL of EOS node
  chainId: "Ledger",                                                      // ID of a chain containing Volentix ledger
  ledgerAccount: "EOS8TJpbWeQEoaMZMZzmo4SqC7DUucEUHRQJs1x7cXLcTqRhiJ7VF"  // EOS account with the ledger contracts
})

ledger.retrieveBalance({
  account: "EOS6Ew693sd741xNhBPGaa72cujaaMByyJ7UBpWR5c9QnCsVcRuP4",       // the ID of an account
  key: "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW"            // the public key of an EOS wallet
}).then(transactions => {
  // transaction data format TBD
  transactions.forEach(transaction => {
    console.log(transaction)
  })
})
```

## API

Each of these will be fully defined shortly.

### `constructor`

### `recordTransaction`

### `retrieveBalance`

### `retrieveTransactions`

## Development

### Testing

**Config**

In order to run the tests, you will need to first create a `config.json` file. Note that this file will remain on your local machine and never be uploaded into git.

First you need to copy the template file with the following command:

```
cp test/config.json.template test/config.json
```

Then open up a text editor and modify the following values:

| KEY                            | Description                               |
|--------------------------------|-------------------------------------------|
| `REPLACE_THE_ID_OF_THE_CHAIN`    | The chain id of your running instance     |
| `REPLACE_WITH_YOUR_KEY_PROVIDER` | Your key provider                         |
| `REPLACE_WITH_HOST_URL`          | The endpoint of your EOS running instance |


**NPM**

Install the dependancies.

```
npm install
```

**Run The Tests**

You can run the tests with the following command.

```
npm run test
```

## Maintainers

- [@sylvaincormier](https://github.com/sylvaincormier)
- [@shawnlauzon](https://github.com/shawnlauzon)
- [@realrhys](https://github.com/realrhys)

## Contribute

See [the contribute file](contribute.md)!

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Volentix Labs Inc.
