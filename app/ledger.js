Eos = require('eosjs')

class Ledger {
    constructor(config) {
        this.LEDGER_ACCOUNT_NAME = "vltxledger1";
        this.eos = Eos(config);
    }

    async retrieveBalance({ account, key }) {
        console.log("retrieveBalance");
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);
        console.log("contract", contract);

        return contract.getrcrd(account, key)
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
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);
        console.log("contract", contract);

        return contract.rcrdtfr(from.account, from.key, to.account, to.key, amount);
    }

    // Retrieve all transactions performed from / to this account & key
    async retrieveTransactions({ account, key }) {
        console.log('retrieveTransactions');
        const contract = await this.eos.contract(this.LEDGER_ACCOUNT_NAME);
        console.log('contract', contract);

        return contract.getrcrd(from.account, from.key, to.account, to.key);
    }
}

module.exports = Ledger;
