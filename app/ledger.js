Eos = require('eosjs')

class Ledger {
    constructor(config) {
        this.LEDGER_ACCOUNT_NAME = "vltxledger";
        this.TREASURY_ACCOUNT_NAME = "vltxtres";

        this.eos = Eos(Object.assign({}, config, {
            expireInSeconds: 60,
            broadcast: true,
            verbose: true,
            debug: true,
            sign: true,
        }))
    }

    async retrieveBalance({ account, key }) {
        console.log("retrieveBalance");
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

        return contract.getrcrd({
            tokey: key.toString()
        })
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
    async recordTransfer({ from, to, amount }) {
        console.log("recordTransfer");

        const options = {
            authorization: this.LEDGER_ACCOUNT_NAME + "@active",
            broadcast: true,
            sign: true
        }

        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

        return contract.rcrdtfr({
            s: this.TREASURY_ACCOUNT_NAME,
            fromaccount: from.account,
            toaccount: to.account,
            fromkey: from.key ? from.key.toString() : "",
            tokey: to.key ? to.key.toString() : "",
            amount
        });
    }

    async getBlock() {
        const info = await this.eos.getInfo({})
        console.log('info', info)
        const block = await this.eos.getBlock(info.last_irreversible_block_num)
        console.log('block', block)
    }

    // Retrieve all transactions performed from / to this account & key
    async retrieveTransactions({ account, key }) {
        console.log('retrieveTransactions');
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);

        return contract.getrcrd(from.account, from.key, to.account, to.key);
    }
}

module.exports = Ledger;
