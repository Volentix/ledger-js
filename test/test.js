var expect    = require("chai").expect;

const VtxLedger  = require('../app/ledger')

describe("Whatever", function() {
    it("calls the contract and transfers funds", function(done) {

/*
        const config = {
            'chainId': 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
            'keyProvider': '5KfpCFGR8SBZ3At7oGTDcHgzXgCZRGV6hCT7DTfReYQ63gi3gQz',
            'httpEndpoint': 'http://ec2-35-183-54-128.ca-central-1.compute.amazonaws.com:8888',
            'expireInSeconds': 60,
            'broadcast': true,
            'verbose': true,
            'sign': true,
        };
        const request = {
            "transfer": {
                "s": "test",
                "fromAccount": "Distribution",
                "toAccount": "Trust",
                "fromKey": 1234,
                "toKey": 1234,
                "amount": 100,
            },
            "auth": {
                authorization: [ `test@active` ]
            },
            "callback": function(data) {
                console.log(JSON.stringify(data,null,4) )
                done();
            }
        };
        
        const ledger = new VtxLedger(config);
        ledger.callContract(request);
 */
        
        VtxLedger.createLedger(
            /* Chain id from the blockchain */
            'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', 
            /* Private key to the contract */
            '5KfpCFGR8SBZ3At7oGTDcHgzXgCZRGV6hCT7DTfReYQ63gi3gQz',
            /* URL. */ 
            'http://ec2-35-183-54-128.ca-central-1.compute.amazonaws.com:8888', 
            60, 
            true, 
            true, 
            true 
        );

        const datacallback = function(data) {
            console.log(JSON.stringify(data,null,4) )
            done();
        }

        VtxLedger.callContract(
            "test1", 
            "Distribution", 
            "Trust", 
            1234, 
            1234, 
            1234,
            `test1@active`,
            datacallback
        );
       
        expect(1).to.equal(1);
    });
});