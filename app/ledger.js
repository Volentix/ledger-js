Eos = require('eosjs')

let ledger = {};

class Ledger {
    constructor(config) {
        this.ledger = Eos(config);
    }

    callContract(request) {
        this.ledger.contract(request.transfer.s)
            .then(test => test.rcrdtrf(
                request.transfer, 
                request.auth
            ).catch(function (err) {
                console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRR")
            })
        ).then(function(data) { if(request.callback) {request.callback(data);}})
        .catch(function (err) {
            console.log("ERRRRRRRRRRRRRRRRRRRRRRRRRRRR + " + err)
        })
    }
}

module.exports = Ledger;

 /*
module.exports.createLedger = function(chainid, keyprovider, httpendpoint, expire, broadcast, verbose, sign) {
	config = {
  		'chainId': chainid,
  		'keyProvider': keyprovider,
  		'httpEndpoint': httpendpoint,
  		'expireInSeconds': expire,
  		'broadcast': broadcast,
  		'verbose': verbose,
  		'sign': sign,
    }
    ledger = Eos(config)
}

module.exports.callContract = function( contract, fromaccount, toaccount, fromkey, tokey, amount, authorization, datacallback){
    ledger.contract(contract).then(test1 => test1.rcrdtrf(
        {
            
        "s": contract,
        "fromAccount": fromaccount,
        "toAccount": toaccount,
        "fromKey": fromkey,
        "toKey": tokey,
        "amount": amount,
        },
        {
            authorization: [ authorization ]
        }
    ).catch()).then(function(data) { if(datacallback) {datacallback(data);}})
    
 }
*/