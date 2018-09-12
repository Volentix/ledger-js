Eos = require("eosjs");

const moment = require("moment");

class Ledger {
  constructor(config) {
    this.LEDGER_ACCOUNT_NAME = "vtxledger";
    this.TREASURY_ACCOUNT_NAME = "vtxtreasury";

    this.eos = Eos(
      Object.assign({}, config, {
        expireInSeconds: 60,
        verbose: false,
        debug: false,
        sign: true,
        authorization: this.LEDGER_ACCOUNT_NAME + "@active"
      })
    );
  }

  async retrieveBalance({ account, key }) {
    const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

    const balance = await contract.getblnc({
      account,
      tokey: key ? key : ""
    });

    return JSON.parse(
      balance.processed.action_traces[0].console.replace(/'/g, '"')
    );
  }

  // {
  //     'authorization':['vtxledger@active']
  // }

  // recordTransfer({
  //     from: {
  //         account: "vtxdistrib"
  //     },
  //     to: {
  //         account: "vtxtrust",
  //         key: "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW"
  //     },
  //     amount: 123.45
  // })
  //
  // Returns: Promise
  async recordTransfer({ from, to, amount }) {
    const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

    const submittedAt = new Date();

    const transfer = await contract.rcrdtfr({
      s: this.TREASURY_ACCOUNT_NAME,
      fromaccount: from.account,
      toaccount: to.account,
      fromkey: from.key ? from.key : "",
      tokey: to.key ? to.key : "",
      amount
    });

    return {
      from,
      to,
      amount,
      submittedAt: moment(submittedAt).format(),
      id: transfer.processed.id,
      currency: "VTX" // TODO Should be returned from server
    };
  }

  // Retrieve all transactions performed from / to this account & key
  async retrieveTransactions({ account, key, limit }) {
    const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

    const transactions = await contract.retrvtxns({
      account,
      tokey: key ? key : "",
      limit: limit ? limit : 10
    });

    return {
      transactions: []
    };
  }
}

module.exports = Ledger;
