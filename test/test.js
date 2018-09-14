require("dotenv").config();

const expect = require("chai").expect;
const uuid = require("uuid");

const VtxLedger = require("../app/ledger");

describe("Ledger JS", function() {
  const DISTRIBUTION_ACCOUNT = "vtxdistrib";
  const TRUST_ACCOUNT = "vtxtrust";
  const TEST_WALLET = "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW";

  let ledger = {};
  let testAmount = 0;

  before(function() {
    const config = {
      httpEndpoint: process.env.HTTP_ENDPOINT,
      chainId: process.env.CHAIN_ID,
      keyProvider: process.env.KEY_PROVIDER
    };

    ledger = new VtxLedger(config);
  });

  this.beforeEach(function() {
    testAmount = getRandomInt(1, 1000);
  });

  it("retrieves a zero balance from a new wallet", async function() {
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      wallet: uuid()
    });

    expect(balance).to.deep.equal({
      amount: 0,
      currency: "VTX"
    });
  });

  it("retrieves a balance from account", async function() {
    const balance = await ledger.retrieveBalance({
      account: DISTRIBUTION_ACCOUNT
    });

    expect(balance)
      .to.have.a.property("amount")
      .that.is.a("number")
      .that.is.above(100);

    expect(balance)
      .to.have.a.property("currency")
      .that.equals("VTX");
  });

  it("transfers funds from account to wallet", async function() {
    const testWalletBalance = await getTestWalletBalance();
    console.log("Test wallet has " + testWalletBalance);
    const distributionAccountBalance = await getDistributionAccountBalance();
    console.log("Distribution account has " + distributionAccountBalance);

    // Transfer some random amount
    console.log("Transferring " + testAmount + " VTX");

    await ledger.recordTransfer({
      from: {
        account: DISTRIBUTION_ACCOUNT
      },
      to: {
        account: TRUST_ACCOUNT,
        wallet: TEST_WALLET
      },
      amount: testAmount
    });

    const newTestWalletBalance = await getTestWalletBalance();
    console.log("Test wallet now has " + newTestWalletBalance);
    const newDistributionAccountBalance = await getDistributionAccountBalance();
    console.log(
      "Distribution account now has " + newDistributionAccountBalance
    );

    expect(newTestWalletBalance).to.equal(testWalletBalance + testAmount);
    expect(newDistributionAccountBalance).to.equal(
      distributionAccountBalance - testAmount
    );
  });

  it("transfers funds from wallet to account", async function() {
    let testWalletBalance = await getTestWalletBalance();
    console.log("Test wallet has " + testWalletBalance);
    const distributionAccountBalance = await getDistributionAccountBalance();
    console.log("Distribution account has " + distributionAccountBalance);

    if (testWalletBalance <= 0) {
      // transfer some VTX if there isn't any yet
      await ledger.recordTransfer({
        from: {
          account: DISTRIBUTION_ACCOUNT
        },
        to: {
          account: TRUST_ACCOUNT,
          wallet: TEST_WALLET
        },
        amount: testAmount
      });
      testWalletBalance = testAmount;
    }

    // Transfer some random amount
    const transferAmount = getRandomInt(
      1,
      testWalletBalance > 100 ? 100 : testWalletBalance
    );
    console.log("Transferring " + transferAmount + " VTX");

    await ledger.recordTransfer({
      from: {
        account: TRUST_ACCOUNT,
        wallet: TEST_WALLET
      },
      to: {
        account: DISTRIBUTION_ACCOUNT
      },
      amount: transferAmount
    });

    const newTestWalletBalance = await getTestWalletBalance();
    console.log("Test wallet now has " + newTestWalletBalance);
    const newDistributionAccountBalance = await getDistributionAccountBalance();
    console.log(
      "Distribution account now has " + newDistributionAccountBalance
    );

    expect(newTestWalletBalance).to.equal(testWalletBalance - transferAmount);
    expect(newDistributionAccountBalance).to.equal(
      distributionAccountBalance + transferAmount
    );
  });

  it("cannot transfer more funds than a wallet contains", async function() {
    const testWalletBalance = await getTestWalletBalance();
    console.log("Test wallet has " + testWalletBalance);

    // Transfer some random amount more than the wallet balance
    const transferAmount = testWalletBalance + getRandomInt(1, 100);
    console.log("Transferring " + transferAmount + " VTX");

    try {
      await ledger.recordTransfer({
        from: {
          account: TRUST_ACCOUNT,
          wallet: TEST_WALLET
        },
        to: {
          account: DISTRIBUTION_ACCOUNT
        },
        amount: transferAmount
      });

      expect.fail("", "", "Expected transfer to fail");
    } catch (e) {
      if (e.name === "AssertionError") {
        throw e;
      }
    }
  });

  it("creates a transfer from a wallet to an account and returns proper parameters", async function() {
    const transfer = await ledger.recordTransfer({
      from: {
        account: TRUST_ACCOUNT,
        wallet: TEST_WALLET
      },
      to: {
        account: DISTRIBUTION_ACCOUNT
      },
      amount: testAmount
    });

    expect(transfer).to.include.keys({
      from: {
        account: TRUST_ACCOUNT,
        wallet: TEST_WALLET
      },
      to: {
        account: DISTRIBUTION_ACCOUNT
      },
      amount: testAmount
    });

    expect(transfer)
      .to.have.a.property("id")
      .that.is.a("string")
      .that.has.lengthOf.at.least(64);

    expect(transfer)
      .to.have.a.property("currency")
      .that.equals("VTX");

    expect(transfer)
      .to.have.a.property("submittedAt")
      .that.is.a("string")
      .that.matches(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
  });

  it("creates a transfer from an account to a wallet and returns proper parameters", async function() {
    const transfer = await ledger.recordTransfer({
      from: {
        account: DISTRIBUTION_ACCOUNT
      },
      to: {
        account: TRUST_ACCOUNT,
        wallet: TEST_WALLET
      },
      amount: testAmount
    });

    expect(transfer).to.include.keys({
      from: {
        account: DISTRIBUTION_ACCOUNT
      },
      to: {
        account: TRUST_ACCOUNT,
        wallet: TEST_WALLET
      },
      amount: testAmount
    });

    expect(transfer)
      .to.have.a.property("id")
      .that.is.a("string")
      .that.has.lengthOf.at.least(64);

    expect(transfer)
      .to.have.a.property("currency")
      .that.equals("VTX");

    expect(transfer)
      .to.have.a.property("submittedAt")
      .that.is.a("string")
      .that.matches(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
  });

  it("retrieves zero transactions from a new wallet", async function() {
    const transactions = await ledger.retrieveTransactions({
      account: TRUST_ACCOUNT,
      wallet: uuid()
    });

    expect(transactions).to.deep.equal({
      transactions: []
    });
  });

  it("retrieves 1 transaction from a wallet", async function() {
    const transactions = await ledger.retrieveTransactions({
      account: TRUST_ACCOUNT,
      wallet: TEST_WALLET,
      limit: 1
    });

    expect(transactions)
      .to.have.property("transactions")
      .which.is.an("array")
      .lengthOf(1);
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

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});
