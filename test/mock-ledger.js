class Ledger {
  constructor(config) {
  }

  async retrieveBalance({ account, key }) {
      console.log('retrieveBalance');
      return new Promise({
        amount: 11.21,
        currency: "VTX"
      });
  }

  // recordTransfer({
  //     from: {
  //         account: "vltxdistrib"
  //     },
  //     to: {
  //         account: "vltxtrust11",
  //         key: "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW"
  //     },
  //     amount: 123.45
  // })
  //
  // Returns: Promise
  async recordTransfer(transferDetails) {
    return new Promise(
      randomTransfer(transferDetails)
    )
  }

  // Returns two transactions
  async retrieveTransactions({ account, key }) {
    return new Promise({
      transactions: [ 
        randomTransfer({ from: "vltxdistrib", to: { account, key } }), 
        randomTransfer({ from: "vltxdistrib", to: { account, key } }) ]
    })
  }
}

function randomTransfer({ from, to, amount }) {
  return {
    id: (Math.random() * 100000).toString(),
    from,
    to,
    amount: amount ? amount : Math.random() * 10000,
    currency: "VTX"  
  }
}