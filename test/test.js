require("dotenv").config();

const expect = require("chai").expect;
const uuid = require("uuid");

const VtxLedger = require("../app/ledger");

describe("Ledger JS", function () {
  this.timeout(5000);

  const DISTRIBUTION_ACCOUNT = "vtxdistrib";
  const TRUST_ACCOUNT = "vtxtrust";
  const TEST_WALLET = "EOS62L2r4FqnCbHAspPS3KBByGa728G3UDYxGkTY15mad97M4JhzN";

  let ledger = {};

  before(function () {
    const config = {
      httpEndpoint: process.env.HTTP_ENDPOINT,
      chainId: process.env.CHAIN_ID,
      keyProvider: process.env.KEY_PROVIDER
    };

    ledger = new VtxLedger(config); 
  });

   it("retreives transactions", async function () {
    const transactions = await ledger.retrieveTransactions({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET,
      limit:4
    });
    console.log(transactions.output1)
    //expect(transactions.output.rows)
    //.to.have.property("fromAccount")
      //.which.is.an("array")
      //.lengthOf(1);

  });

  it("retrieves a  balance from wallet", async function() {
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET
    });
    console.log(balance)
    // expect(balance).to.deep.equal({
    //   amount: 0,
    //   currency: "VTX"
    // });
  });


});


  

  // it("retrieves a balance from account", async function() {
  //   const balance = await ledger.retrieveBalance({
  //     account: DISTRIBUTION_ACCOUNT
  //   });

  //   expect(balance)
  //     .to.have.a.property("amount")
  //     .that.is.a("number")
  //     .that.is.above(100);

  //   expect(balance)
  //     .to.have.a.property("currency")
  //     .that.equals("VTX");
  // });

  // it("transfers funds from account to wallet", async function() {
  //   const distributionAccountBalance = await getDistributionAccountBalance();
  //   // console.log("Distribution account has " + distributionAccountBalance);
  //   const testWalletBalance = await getTestWalletBalance();
  //   // console.log("Test wallet has " + testWalletBalance);

  //   // Transfer some random amount
  //   const transferAmount = getRandomInt(1, 100);
  //   // console.log("Transferring " + transferAmount + " VTX from account");

  //   await ledger.recordTransfer({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     amount: transferAmount
  //   });

  //   const newTestWalletBalance = await getTestWalletBalance();
  //   // console.log("Test wallet now has " + newTestWalletBalance);
  //   const newDistributionAccountBalance = await getDistributionAccountBalance();
  //   // console.log(
  //   //   "Distribution account now has " + newDistributionAccountBalance
  //   // );

  //   expect(newTestWalletBalance).to.equal(testWalletBalance + transferAmount);
  //   expect(newDistributionAccountBalance).to.equal(
  //     distributionAccountBalance - transferAmount
  //   );
  // });

  // it("transfers funds from wallet to account", async function() {
  //   let testWalletBalance = await getTestWalletBalance();
  //   // console.log("Test wallet has " + testWalletBalance);
  //   const distributionAccountBalance = await getDistributionAccountBalance();
  //   // console.log("Distribution account has " + distributionAccountBalance);

  //   if (testWalletBalance <= 0) {
  //     const newTestWalletBalance = getRandomInt(0, 1000);
  //     // transfer some VTX if there isn't any yet
  //     await ledger.recordTransfer({
  //       from: {
  //         account: DISTRIBUTION_ACCOUNT
  //       },
  //       to: {
  //         account: TRUST_ACCOUNT,
  //         wallet: TEST_WALLET
  //       },
  //       amount: newTestWalletBalance
  //     });
  //     testWalletBalance = await getTestWalletBalance();
  //   }

  //   // Transfer some random amount
  //   const transferAmount = getRandomInt(
  //     1,
  //     testWalletBalance > 100 ? 100 : testWalletBalance
  //   );
  //   // console.log("Transferring " + transferAmount + " VTX from wallet");

  //   await ledger.recordTransfer({
  //     from: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     to: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     amount: transferAmount
  //   });

  //   const newTestWalletBalance = await getTestWalletBalance();
  //   // console.log("Test wallet now has " + newTestWalletBalance);
  //   const newDistributionAccountBalance = await getDistributionAccountBalance();
  //   // console.log(
  //   //   "Distribution account now has " + newDistributionAccountBalance
  //   // );

  //   expect(newTestWalletBalance).to.equal(testWalletBalance - transferAmount);
  //   expect(newDistributionAccountBalance).to.equal(
  //     distributionAccountBalance + transferAmount
  //   );
  // });

  // it("cannot transfer more funds than a wallet contains", async function() {
  //   const testWalletBalance = await getTestWalletBalance();
  //   // console.log("Test wallet has " + testWalletBalance);

  //   // Transfer some random amount more than the wallet balance
  //   const transferAmount = testWalletBalance + getRandomInt(1, 100);
  //   // console.log("Transferring " + transferAmount + " VTX");

  //   try {
  //     await ledger.recordTransfer({
  //       from: {
  //         account: TRUST_ACCOUNT,
  //         wallet: TEST_WALLET
  //       },
  //       to: {
  //         account: DISTRIBUTION_ACCOUNT
  //       },
  //       amount: transferAmount
  //     });

  //     expect.fail("", "", "Expected transfer to fail");
  //   } catch (e) {
  //     expect(e.name).to.equal("insufficient_funds");
  //   }
  // });

  // it("creates a transfer from a wallet to an account and returns sent parameters", async function() {
  //   const testAmount = getRandomInt(1, 100);
  //   const transfer = await ledger.recordTransfer({
  //     from: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     to: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     amount: testAmount
  //   });

  //   expect(transfer).to.include.keys({
  //     from: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     to: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     amount: testAmount
  //   });

  //   expect(transfer)
  //     .to.have.a.property("id")
  //     .that.is.a("string")
  //     .that.has.lengthOf.at.least(64);

  //   expect(transfer)
  //     .to.have.a.property("currency")
  //     .that.equals("VTX");

  //   expect(transfer)
  //     .to.have.a.property("submittedAt")
  //     .that.is.a("string")
  //     .that.matches(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
  // });

  // it("creates a transfer from an account to a wallet and returns sent parameters", async function() {
  //   const testAmount = getRandomInt(1, 100);
  //   const transfer = await ledger.recordTransfer({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     amount: testAmount
  //   });

  //   expect(transfer).to.include.keys({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     amount: testAmount
  //   });

  //   expect(transfer)
  //     .to.have.a.property("id")
  //     .that.is.a("string")
  //     .that.has.lengthOf.at.least(64);

  //   expect(transfer)
  //     .to.have.a.property("currency")
  //     .that.equals("VTX");

  //   expect(transfer)
  //     .to.have.a.property("submittedAt")
  //     .that.is.a("string")
  //     .that.matches(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
  // });

  // it("creates a transfer with comment field", async function() {
  //   const testAmount = getRandomInt(1, 100);
  //   const testComment = "A test comment";
  //   const transfer = await ledger.recordTransfer({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: TEST_WALLET
  //     },
  //     amount: testAmount,
  //     comment: testComment
  //   });

  //   expect(transfer.comment).to.equal(testComment);
  // });

  // it("retrieves zero transactions from a new wallet", async function() {
  //   const transactions = await ledger.retrieveTransactions({
  //     account: TRUST_ACCOUNT,
  //     wallet: uuid()
  //   });

  //   expect(transactions).to.deep.equal({
  //     transactions: []
  //   });
  // });

  // it("retrieves 1 transaction from a wallet with only 1 transaction", async function() {
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

  //   expect(transactions)
  //     .to.have.property("transactions")
  //     .which.is.an("array")
  //     .lengthOf(1);

  //   const transaction = transactions.transactions[0];
  //   expect(transaction).to.equal({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: newTestWallet
  //     },
  //     amount: testAmount
  //   });
  // });

  // it("retrieves a transaction with a comment", async function() {
  //   const testAmount = getRandomInt(1, 100);
  //   const testComment = "a test comment";
  //   const newTestWallet = uuid();
  //   await ledger.recordTransfer({
  //     from: {
  //       account: DISTRIBUTION_ACCOUNT
  //     },
  //     to: {
  //       account: TRUST_ACCOUNT,
  //       wallet: newTestWallet
  //     },
  //     amount: testAmount,
  //     comment: testComment
  //   });

  //   const transactions = await ledger.retrieveTransactions({
  //     account: TRUST_ACCOUNT,
  //     wallet: newTestWallet
  //   });

  //   expect(transactions.transactions[0].comment).to.equal(testComment);
  // });

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

 

// it("retrieves 1 transaction from a wallet when requesting only 1", async function() {
//   const transactions = await ledger.retrieveTransactions({
//     account: TRUST_ACCOUNT,
//     wallet: TEST_WALLET,
//     limit: 1
//   });

//   expect(transactions)
//     .to.have.property("transactions")
//     .which.is.an("array")
//     .lengthOf(1);
// });

// it("retrieves 2 transactions from a wallet when requesting only 2", async function() {
//   const transactions = await ledger.retrieveTransactions({
//     account: TRUST_ACCOUNT,
//     wallet: TEST_WALLET,
//     limit: 2
//   });

//   expect(transactions)
//     .to.have.property("transactions")
//     .which.is.an("array")
//     .lengthOf(2);
// });

// async function clearTestWallet() {
//   // Move any balance from the trust account back to the distribution account
//   const balance = await ledger.retrieveBalance({
//     account: TRUST_ACCOUNT,
//     wallet: TEST_WALLET
//   });

//   if (balance.amount === 0) {
//     return Promise.resolve();
//   }

//   // Now move that amount from the wallet back to the distribution account
//   return ledger.recordTransfer({
//     from: {
//       account: TRUST_ACCOUNT,
//       wallet: TEST_WALLET
//     },
//     to: {
//       account: DISTRIBUTION_ACCOUNT
//     },
//     amount: balance.amount
//   });
// }

// async function getTestWalletBalance() {
//   const balance = await ledger.retrieveBalance({
//     account: TRUST_ACCOUNT,
//     wallet: TEST_WALLET
//   });

//   return balance.amount;
// }

// async function getDistributionAccountBalance() {
//   const balance = await ledger.retrieveBalance({
//     account: DISTRIBUTION_ACCOUNT
//   });

//   return balance.amount;
// }

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
//});
