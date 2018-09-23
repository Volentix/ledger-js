Eos = require("eosjs");

const moment = require("moment");
const uuid = require("uuid");

const BOILERPLATE_ASSERTION_TEXT = "assertion failure with message: ";

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
      nonce: uuid(),
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
  async recordTransfer({ from, to, amount, comment }) {
    const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

    const submittedAt = new Date();

    try {
      const transfer = await contract.rcrdtfr({
        nonce: uuid(),
        s: this.TREASURY_ACCOUNT_NAME,
        fromaccount: from.account,
        toaccount: to.account,
        fromkey: from.wallet ? from.wallet : "",
        tokey: to.wallet ? to.wallet : "",
        amount,
        comment: comment ? comment : ""
      });

      // console.log("recordTransfer: ", JSON.stringify(transfer, null, 2));

      return {
        from,
        to,
        amount,
        submittedAt: moment(submittedAt).format(),
        id: transfer.processed.id,
        currency: "VTX", // TODO Should be returned from server
        comment
      };
    } catch (eStr) {
      const e = JSON.parse(eStr);
      // { "code": 500, "message": "Internal Service Error", "error": { "code": 3050003, "name": "eosio_assert_message_exception", "what": "eosio_assert_message assertion failure", "details": [{ "message": "assertion failure with message: insufficient_funds", "file": "wasm_interface.cpp", "line_number": 930, "method": "eosio_assert" }, { "message": "pending console output: Wallet to account", "file": "apply_context.cpp", "line_number": 61, "method": "exec_one" }] } }

      if (
        e.error &&
        e.error.details &&
        e.error.details[0] &&
        e.error.details[0].message &&
        e.error.details[0].message.startsWith(BOILERPLATE_ASSERTION_TEXT)
      ) {
        e.name = e.error.details[0].message.slice(
          BOILERPLATE_ASSERTION_TEXT.length
        );
      }

      throw e;
    }
  }
  // Retrieve all transactions performed from / to this account & wallet
  async retrieveTransactions({ account, wallet, limit }) {
    // const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);
    const output = await this.eos.getTableRows({
      code: 'stdvtxledger',
      scope: 'stdvtxledger',
      table: 'entry',
      json: true,
    });
    output.rows.splice(0, Object.keys(output.rows).length - limit);
    return {
      output
    };

    vtxledger, vtxledger, entry;
  }
}

module.exports = Ledger;
