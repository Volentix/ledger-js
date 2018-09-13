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

  async retrieveBalance({ account, wallet }) {
    const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

    const balance = await contract.getblnc({
      account,
      tokey: wallet ? wallet : ""
    });

    // console.log("retrieveBalance: ", JSON.stringify(balance, null, 2));

    return JSON.parse(
      balance.processed.action_traces[0].console.replace(/'/g, '"')
    );
  }

  // recordTransfer({
  //     from: {
  //         account: "vtxdistrib"
  //     },
  //     to: {
  //         account: "vtxtrust",
  //         wallet: "EOS5vBqi8YSzFCeTv4weRTwBzVkGCY5PN5Hm1Gp3133m8g9MtHTbW"
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
      fromkey: from.wallet ? from.wallet : "",
      tokey: to.wallet ? to.wallet : "",
      amount
    });

    // console.log("recordTransfer: ", JSON.stringify(transfer, null, 2));

    return {
      from,
      to,
      amount,
      submittedAt: moment(submittedAt).format(),
      id: transfer.processed.id,
      currency: "VTX" // TODO Should be returned from server
    };
  }

  // Retrieve all transactions performed from / to this account & wallet
  async retrieveTransactions({ account, wallet, limit }) {
    const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

    const transactions = await contract.retrvtxns({
      account,
      tokey: wallet ? wallet : "",
      limit: limit ? limit : 10
    });

    // console.log(
    //   "retrieveTransactions: ",
    //   JSON.stringify(transactions, null, 2)
    // );

    return {
      transactions: []
    };
  }
}

module.exports = Ledger;
