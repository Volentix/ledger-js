require('dotenv').config()

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const should = chai.should();

const VtxLedger  = require('../app/ledger')

describe("Ledger JS", function() {
    const TRUST_ACCOUNT = "vltxtrust00";
    const TEST_PUBLIC_KEY = "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW";

    it("retrieves a balance", function() {

        const config = {
            'chainId': process.env.CHAIN_ID,
            'keyProvider': process.env.KEY_PROVIDER,
            'httpEndpoint': process.env.HTTP_ENDPOINT
        };

        const ledger = new VtxLedger(config);
        
        return ledger.retrieveBalance({
          account: TRUST_ACCOUNT,
          key: TEST_PUBLIC_KEY
        }).should.eventually.equal(100)
     });
});