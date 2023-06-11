'use strict';

const blockchainTransactions = require('./lib/blockchainTransactions');

module.exports.blockchainTransactions = blockchainTransactions;
module.exports.contracts = [blockchainTransactions];