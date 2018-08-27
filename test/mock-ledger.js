const uuidv4 = require('uuid/v4');

class Ledger {
  constructor(config) {
  }

  async retrieveBalance({ account, key }) {
      console.log('retrieveBalance');
      return Promise.resolve({
        amount: 11.21,
        currency: "VTX"
      });
  }

  // recordTransfer({
  //     from: {
  //         account: "vtxdistrib"
  //     },
  //     to: {
  //         account: "vtxtrust11",
  //         wallet: "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW"
  //     },
  //     amount: 123.45
  // })
  //
  // Returns: Promise
  async recordTransfer(transferDetails) {
    return Promise.resolve(
      randomTransfer(transferDetails)
    )
  }

  // Returns two transactions
  async retrieveTransactions({ account, wallet }) {
    return Promise.resolve({
      transactions: [ 
        randomTransfer({ from: "vtxdistrib", to: { account, wallet } }), 
        randomTransfer({ from: "vtxdistrib", to: { account, wallet } }) ]
    })
  }
}

function randomTransfer({ from, to, amount }) {
  return {
    id: uuidv4(),
    from,
    to,
    amount: amount ? amount : Math.random() * 10000,
    currency: "VTX"  
  }
}
