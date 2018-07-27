import Web3 from 'web3';
import Big from 'big.js';

function getWallet(cb) {
  if (window.web3 && window.web3.currentProvider.isMetaMask) {
    window.web3.eth.getAccounts(cb);
  } else {
    throw new Error();
  }
}

function getWeb3() {
  let originalWeb3 = window.web3;
  if (originalWeb3) {
    return new Web3(originalWeb3.currentProvider);
  }else{
    return null;
  }
}

function getIncenseContract() {
  let web3 = getWeb3();
  let {abi, address} = require('./IncenseContract');
  return new web3.eth.Contract(abi, address);
}

function getExchangeContract() {
  let web3 = getWeb3();
  let {abi, address} = require('./ExchangeContract');
  return new web3.eth.Contract(abi, address);
}

function getMercyContract() {
  let web3 = getWeb3();
  let {abi, address} = require('./MercyContract');
  return new web3.eth.Contract(abi, address);
}


function getBalance(wallet, cb) {
  let contract = getIncenseContract();
  contract.methods.balanceOf(wallet).call({from: wallet}, cb);
}

function getSellPrice(wallet, cb) {
  let contract = getExchangeContract();
  contract.methods.getSellPrice().call({from: wallet}, cb);
}

function getBuyPrice(wallet, cb) {
  let contract = getExchangeContract();
  contract.methods.getBuyPrice().call({from: wallet}, cb);
}

function buyToken(wallet, buyWei, amount, cb) {
  let contract = getExchangeContract();
  let buyWeiBig=Big(buyWei);
  let amt=Big(amount);
  let value=amt.times(buyWeiBig);
  return contract.methods.buy().send({value: value.toString(), from: wallet}).on('receipt', cb);
}

function sellToken(wallet, amount, cb) {
  let contract = getExchangeContract();
  return contract.methods.sell(amount).send({from: wallet}).on('receipt', cb);
}

function approve(wallet, amount, cb) {
  let contract = getIncenseContract();
  let {address} = require('./MercyContract');
  return contract.methods.approve(address, amount).send({from: wallet}).on('receipt', cb);
}

// function getGameEndTime(wallet, cb) {
//   let contract = getMercyContract();
//   contract.methods.getEndTime().call({from: wallet}, cb);
// }
//
// function getPot(wallet, cb) {
//   let contract = getMercyContract();
//   contract.methods.getPot().call({from: wallet}, cb);
// }
//
// function isGameEnded(wallet, cb) {
//   let contract = getMercyContract();
//   contract.methods.isGameEnded().call({from: wallet}, cb);
// }

function bid(wallet, cb) {
  let contract = getMercyContract();
  return contract.methods.bid().send({from: wallet}).on('receipt', cb);
}


function register(wallet, username, referral, cb) {
  let web3 = require('web3-utils');
  let contract = getMercyContract();
  return contract.methods.register(web3.asciiToHex(username), web3.asciiToHex(referral))
    .send({from: wallet}).on('receipt', cb);
}


// function restart(wallet, cb) {
//   let contract = getMercyContract();
//   return contract.methods.restart().send({from: wallet}).on('receipt', cb);
// }

function win(wallet, cb) {
  let contract = getMercyContract();
  return contract.methods.win().send({from: wallet}).on('receipt', cb);
}

function getAllowance(wallet,cb){
  let contract=getIncenseContract();
  let mercy = getMercyContract();
  return contract.methods.allowance(wallet, mercy.address).call({from:wallet},cb);
}


function getGameStatus(wallet, cb) {
  let contract = getMercyContract();
  contract.methods.getGameStatus().call({from: wallet}, cb);
}


export default {
  getWallet: getWallet,
  getGameStatus: getGameStatus,
  bid: bid,
  buy: buyToken,
  sell:sellToken,
  getBuyPrice: getBuyPrice,
  getSellPrice: getSellPrice,
  getBalance: getBalance,
  getAllowance:getAllowance,
  register: register,
  getWeb3:getWeb3,
  win: win,
  approve: approve
};
