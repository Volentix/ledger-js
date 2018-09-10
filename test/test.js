require('dotenv').config()

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();

const VtxLedger  = require('../app/ledger')

describe("Ledger JS", function() {
    const DISTRIBUTION_ACCOUNT = "vtxdistrib";
    const TRUST_ACCOUNT = "vtxtrust";
    const TEST_WALLET = "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW";
    const TEST_WALLET_2 = "EOS8SGMJ9Xrhc6JJVVU4raTk9kAX8ivkWYrCb5pzbkBEcK4FuBuX6";
    const TEST_AMOUNT = 100;

    let ledger = {}

    before(function() {
        const config = {
            'httpEndpoint': process.env.HTTP_ENDPOINT,
            'chainId': process.env.CHAIN_ID,
            'keyProvider': process.env.KEY_PROVIDER
        };

        ledger = new VtxLedger(config);

        return ledger.recordTransfer({
            from: {
                account: DISTRIBUTION_ACCOUNT,
                key: "to_be_removed"
            }, to: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET
            },
            amount: TEST_AMOUNT
        })
    })

    after(function() {
        return ledger.recordTransfer({
            from: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET
            }, to: {
                account: DISTRIBUTION_ACCOUNT,
                key: "to_be_removed"
            },
            amount: TEST_AMOUNT
        })
    })

    it.skip("retrieves a balance", function() {
        return ledger.retrieveBalance({
          account: TRUST_ACCOUNT,
          key: TEST_WALLET
        }).should.eventually.equal(TEST_AMOUNT)
     });

     it("creates a transfer between wallets and returns an ID", function() {
        return ledger.recordTransfer({
            from: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET
            }, to: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET_2
            },
            amount: TEST_AMOUNT
        }).should.eventually.have.property('id').that.is.a('string').that.has.lengthOf.at.least(64)
    })

    it("creates a transfer between wallets and returns parameters sent", function() {
        return ledger.recordTransfer({
            from: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET
            }, to: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET_2
            },
            amount: TEST_AMOUNT
        }).should.eventually.deep.include({
            from: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET
            }, to: {
                account: TRUST_ACCOUNT,
                key: TEST_WALLET_2
            },
            amount: TEST_AMOUNT
        })
    })
});