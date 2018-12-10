var HDWalletProvider = require("truffle-hdwallet-provider");
var bc_config = require('./config/blockchain-config');

// var infura_apikey = "v3/8cf80ccb22dd4231b0b609cad3f58383";
// var mnemonic = "letter casino spread lawn water toward extend public gasp turn wave bone";
module.exports = {
    networks: {
        ropsten: {
            provider: new HDWalletProvider(bc_config.mnemonic, bc_config.ropsten + bc_config.infura_apikey),
            network_id: 3
        },
        development: {
            provider: new HDWalletProvider(bc_config.mnemonic, bc_config.localRPC),
            gas: 4500000,
            gasPrice: 10000000000,
            network_id: "*"
        }
    }
};