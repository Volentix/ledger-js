const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const VtxLedger  = require('../app/ledger')

describe("Ledger JS", function() {
    it("retrieves a balance", function() {

        const config = {
            'chainId': 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            'keyProvider': '5KfpCFGR8SBZ3At7oGTDcHgzXgCZRGV6hCT7DTfReYQ63gi3gQz',
            'httpEndpoint': 'http://ec2-35-182-243-31.ca-central-1.compute.amazonaws.com:8888',
            'expireInSeconds': 120,
            'broadcast': true,
            'verbose': true,
            'sign': true,
        };

        const ledger = new VtxLedger(config);
        
        return ledger.retrieveBalance({
          account: "vltxtrust00",
          key: "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW"
        }).should.eventually.equal(100)
     });
});