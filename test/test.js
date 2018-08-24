require('dotenv').config()

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();

const VtxLedger  = require('../app/ledger')

describe("Ledger JS", function() {
    const DISTRIBUTION_ACCOUNT = "vltxdistrib.";
    const TRUST_ACCOUNT = "vltxtrust..";
    const TEST_PUBLIC_KEY = "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW";
    const TEST_AMOUNT = 100;

    let ledger = {}

    before(function() {
        const config = {
            'chainId': process.env.CHAIN_ID,
            'keyProvider': process.env.KEY_PROVIDER,
            'httpEndpoint': process.env.HTTP_ENDPOINT
        };

        ledger = new VtxLedger(config);

        return ledger.recordTransfer({
            from: {
                account: DISTRIBUTION_ACCOUNT
            }, to: {
                account: TRUST_ACCOUNT,
                key: TEST_PUBLIC_KEY
            },
            amount: TEST_AMOUNT
        })
    })

    after(function() {
        return ledger.recordTransfer({
            from: {
                account: TRUST_ACCOUNT,
                key: TEST_PUBLIC_KEY
            }, to: {
                account: DISTRIBUTION_ACCOUNT
            },
            amount: TEST_AMOUNT
        })
    })

    it("retrieves a balance", function() {
        return ledger.retrieveBalance({
          account: TRUST_ACCOUNT,
          key: TEST_PUBLIC_KEY
        }).should.eventually.equal(TEST_AMOUNT)
     });
});