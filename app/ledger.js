Eos = require('eosjs')

class Ledger {
    constructor(config) {
        this.LEDGER_ACCOUNT_NAME = "vtxledger";
        this.TREASURY_ACCOUNT_NAME = "vtxtreasury";

        this.eos = Eos(Object.assign({}, config, {
            expireInSeconds: 60,
            verbose: false,
            debug: false,
            authorization: this.LEDGER_ACCOUNT_NAME + "@active"
        }))
    }

    async retrieveBalance({ account, key }) {
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

        return contract.getrcrd({
            tokey: key
        })
    }

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

        return contract.rcrdtfr({
            s: this.TREASURY_ACCOUNT_NAME,
            fromaccount: from.account,
            toaccount: to.account,
            fromkey: from.key,
            tokey: to.key,
            amount
        }).then(transfer => {
            return {
                from,
                to,
                amount,
                id: transfer.processed.id,
                currency: 'VTX', // TODO Should be returned from server
            }
        })
    }

    // Retrieve all transactions performed from / to this account & key
    async retrieveTransactions({ account, key }) {
        console.log('retrieveTransactions');
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

        return contract.getrcrd(from.account, from.key, to.account, to.key);
    }
}

module.exports = Ledger;
