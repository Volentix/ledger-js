# vlabs-ledger-js

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
TODO: Put more badges here.

> A javascript client library for Volentix Ledger

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

You must have access to an EOS instance running.

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

## Usage

This project creates an NPM repository artifact.

TODO: Show how to use it in HTML as well as in node....

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
