require("dotenv").config();

const expect = require("chai").expect;
const uuid = require("uuid");

const VtxLedger = require("../app/ledger");

describe("Ledger JS", function () {
  this.timeout(10000000);

  const DISTRIBUTION_ACCOUNT = "vtxdistrib";
  const TRUST_ACCOUNT = "vtxtrust";
  const LEDGER_ACCOUNT = process.env.LEDGER_ACCOUNT_NAME;

 // const TEST_WALLET = "EOS6EcERTUvtafcLMtrKycWF4JX5tFHnD7d9TPfyF1pdh6tgiWPpd";
  const TEST_WALLET = "EOS81gkcgHo6Q12m8tjd2Ye5m18zbr4wGWh2bqU3XuLYrburgEf2T";


  let ledger = {};

  before(function () {
    const config = {
      httpEndpoint: process.env.HTTP_ENDPOINT,
      chainId: process.env.CHAIN_ID,
      keyProvider: process.env.KEY_PROVIDER
    };

    ledger = new VtxLedger(config, LEDGER_ACCOUNT);

  });

/////////////////////////////////////////////////////
  it("retrieves a balance from account", async function () {
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET
    });
    console.log(balance);
//    expect(balance)
//      .to.have.a.property("amount")
//      .that.is.a("number")
//      .that.is.above(100);
//
//    expect(balance)
//      .to.have.a.property("currency")
//      .that.equals("VTX");
  });
//  /////////////////////////////////////////////////////
//  it("retrieves a balance empty parameters", async function () {
//    const balance = await ledger.retrieveBalance({
//      account: "",
//      wallet: ""
//    });
//
//    expect(balance)
//      .to.have.a.property("amount")
//      .that.is.a("number")
//      .that.equals(0);
//
//    expect(balance)
//      .to.have.a.property("currency")
//      .that.equals("VTX");
//  });
//  /////////////////////////////////////////////////////
//  it("retrieves a  balance from wallet", async function () {
//    const newTestWallet = uuid();
//    const balance = await ledger.retrieveBalance({
//      account: DISTRIBUTION_ACCOUNT,
//      wallet: "EOS6EcERTUvtafcLMtrKycWF4JX5tFHnD7d9TPfyF1pdh6tgiWPpf"
//    });
//	console.log(balance)
//	 expect(balance)
//      .to.have.a.property("amount")
//      .that.is.a("number")
//      .that.is.above(0);
//  });
//
//    /////////////////////////////////////////////////////
//  it("retrieves zero transactions from a new wallet", async function () {
//    const transactions = await ledger.retrieveTransactions({
//      account: TRUST_ACCOUNT,
//      wallet: ""
//    });
//    console.out(Object.keys(output1.rows).length);
//    expect(transactions).to.deep.equal({
//      output1: []
//    });
//  });
//  /////////////////////////////////////////////////////
  it("retrieves transactions from a wallet", async function () {
    const transactions = await ledger.retrieveTransactions({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET
    });
    console.log("Transactions:", transactions.transactions.length);
    //  expect(transactions)
    //    .to.have.property("output1")
    //    .which.is.an("array")
    //    .lengthOf(1);
  });
//   //////////////////////////////////////////////////////////////////////
//  it("retrieves 1 transaction from a wallet when requesting only 1", async function () {
//    const transactions = await ledger.retrieveTransactions({
//      account: TRUST_ACCOUNT,
//      wallet: TEST_WALLET,
//      limit: 1
//    });
//
//    expect(transactions)
//      .to.have.property("output1")
//      .which.is.an("array")
//      .lengthOf(1);
//  });
//  /////////////////////////////////////////////////////
//  it("retrieves 2 transactions from a wallet when requesting only 2", async function () {
//    const transactions = await ledger.retrieveTransactions({
//      account: TRUST_ACCOUNT,
//      wallet: TEST_WALLET,
//      limit: 2
//    });
//
//    expect(transactions)
//      .to.have.property("output1")
//      .which.is.an("array")
//      .lengthOf(2);
//  });



  //TODO
  // it("retrieves a transaction with a block number", async function() {
  //   const testAmount = getRandomInt(1, 100);
  //   const newTestWallet = uuid();
  //   await ledger.recordTransfer({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: newTestWallet
  //     },
  //     amount: testAmount
  //   });

  //   const transactions = await ledger.retrieveTransactions({
  //     account: TRUST_ACCOUNT,
  //     wallet: newTestWallet
  //   });

  //   expect(transactions.transactions[0].blockNumber)
  //     .to.be.a("number")
  //     .which.is.greaterThan(1000);
  // });

  async function getTestWalletBalance() {
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET
    });

    return balance.amount;
  }

  async function getDistributionAccountBalance() {
    const balance = await ledger.retrieveBalance({
      account: DISTRIBUTION_ACCOUNT
    });

    return balance.amount;
  }

  async function clearTestWallet() {
    // Move any balance from the trust account back to the distribution account
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET
    });
  };

});

async function clearTestWallet() {
  // Move any balance from the trust account back to the distribution account
  const balance = await ledger.retrieveBalance({
    account: TRUST_ACCOUNT,
    wallet: TEST_WALLET
  });

  if (balance.amount === 0) {
    return Promise.resolve();
  }

  // Now move that amount from the wallet back to the distribution account
  return ledger.recordTransfer({
    from: {
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET
    },
    to: {
      account: DISTRIBUTION_ACCOUNT
    },
    amount: balance.amount
  });
}



/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

