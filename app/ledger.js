Eos = require('eosjs')

let ledger = {};

class Ledger {
    constructor(config) {
        this.ledger = Eos(config);
    }

    callContract(request) {
        console.log(JSON.stringify(request.transfer, null, 4))
        this.ledger.contract(request.transfer.s)
            .then(test => test.rcrdtfr(
                request.transfer, 
                request.auth
            )
        ).then(function(data) { if(request.callback) {request.callback(data, null);}})
        .catch(function (err) {
            request.callback(null, err);
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
    ledger.contract(contract).then(test => test.rcrdtfr(
        {
            
        "s": contract,
        "fromaccount": fromaccount,
        "toaccount": toaccount,
        "fromkey": fromkey,
        "tokey": tokey,
        "amount": amount,
        },
        {
            authorization: [ authorization ]
        }
    ).catch()).then(function(data) { if(datacallback) {datacallback(data);}})
    
 }
*/