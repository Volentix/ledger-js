require("dotenv").config();

const expect = require("chai").expect;
const uuid = require("uuid");

const VtxLedger = require("../app/ledger");

describe("Ledger JS", function() {
  const DISTRIBUTION_ACCOUNT = "vtxdistrib";
  const TRUST_ACCOUNT = "vtxtrust";
  const TEST_WALLET = "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW";
  const TEST_WALLET_2 = "EOS8SGMJ9Xrhc6JJVVU4raTk9kAX8ivkWYrCb5pzbkBEcK4FuBuX6";

  let ledger = {};
  let testAmount = 0;

  before(function() {
    const config = {
      httpEndpoint: process.env.HTTP_ENDPOINT,
      chainId: process.env.CHAIN_ID,
      keyProvider: process.env.KEY_PROVIDER
    };

    ledger = new VtxLedger(config);

    return clearTestWallet();
  });

  this.beforeEach(function() {
    testAmount = Math.floor(Math.random() * 1000 + 1);
  });

  afterEach(async function() {
    return clearTestWallet();
  });

  it("retrieves a zero balance from a new wallet", async function() {
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      key: uuid()
    });
    console.log("balance", balance);

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
      .that.is.above(1000);

    expect(balance)
      .to.have.a.property("currency")
      .that.equals("VTX");
  });

  it("Transfers funds from account to wallet", async function() {
    const testWalletBalance = await getTestWalletBalance();
    console.log("Test wallet has " + testWalletBalance);
    const distributionAccountBalance = await getDistributionAccountBalance();
    console.log("Distribution account has " + distributionAccountBalance);

    // Transfer some random amount less than the wallet balance
    const transferAmount =
      testAmount - Math.floor(Math.random() * testWalletBalance + 1);

    await ledger.recordTransfer({
      from: {
        account: DISTRIBUTION_ACCOUNT
      },
      to: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
      },
      amount: transferAmount
    });

    const newTestWalletBalance = await getTestWalletBalance();
    console.log("Test wallet now has " + newTestWalletBalance);
    const newDistributionAccountBalance = await getDistributionAccountBalance();
    console.log(
      "Distribution account now has " + newDistributionAccountBalance
    );

    expect(newTestWalletBalance).to.equal(testWalletBalance + transferAmount);
    expect(newDistributionAccountBalance).to.equal(
      distributionAccountBalance - transferAmount
    );
  });

  it("Transfers funds from wallet to account", async function() {
    const testWalletBalance = await getTestWalletBalance();
    console.log("Test wallet has " + testWalletBalance);
    const distributionAccountBalance = await getDistributionAccountBalance();
    console.log("Distribution account has " + distributionAccountBalance);

    // Transfer some random amount less than the wallet balance
    const transferAmount =
      testAmount - Math.floor(Math.random() * testWalletBalance + 1);

    await ledger.recordTransfer({
      from: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
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

  it("creates a transfer from a wallet to an account and returns proper parameters", async function() {
    const transfer = await ledger.recordTransfer({
      from: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
      },
      to: {
        account: DISTRIBUTION_ACCOUNT
      },
      amount: testAmount
    });

    expect(transfer).to.have.all.keys({
      from: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
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
      .that.matches(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}\d{2}/);
  });

  it("creates a transfer from an account to a wallet and returns proper parameters", async function() {
    const transfer = await ledger.recordTransfer({
      from: {
        account: DISTRIBUTION_ACCOUNT
      },
      to: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
      },
      amount: testAmount
    });

    expect(transfer).to.have.all.keys({
      from: {
        account: DISTRIBUTION_ACCOUNT
      },
      to: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
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
      .that.matches(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}\d{2}/);
  });

  async function clearTestWallet() {
    // Move any balance from the trust account back to the distribution account
    const balance = await ledger.retrieveBalance({
      account: TRUST_ACCOUNT,
      key: TEST_WALLET
    });

    if (balance.amount === 0) {
      return Promise.resolve();
    }

    // Now move that amount from the wallet back to the distribution account
    return ledger.recordTransfer({
      from: {
        account: TRUST_ACCOUNT,
        key: TEST_WALLET
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
      key: TEST_WALLET
    });

    return balance.amount;
  }

  async function getDistributionAccountBalance() {
    const balance = await ledger.retrieveBalance({
      account: DISTRIBUTION_ACCOUNT
    });

    return balance.amount;
  }
});
