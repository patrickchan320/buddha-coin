import Web3 from 'web3';
import config from './config/network.js';

const REQUIRED_CONFIRMATION=3;
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
    let web3= new Web3(originalWeb3.currentProvider);
    if(config.wsEnabled){
      web3.setProvider(new Web3.providers.WebsocketProvider(config.wsProviderUrl));
    }
    return web3;
  }else{
    return null;
  }
}

function getIncenseContract() {
  let web3 = getWeb3();
  let {abi,address} = require('./config/IncenseContract');
  return new web3.eth.Contract(abi, address);
}

function getExchangeContract() {
  let web3 = getWeb3();
  let {abi,address} = require('./config/ExchangeContract');
  return new web3.eth.Contract(abi, address);
}

function getMercyContract() {
  let web3 = getWeb3();
  let {abi,address} = require('./config/MercyContract');
  // console.log(mercy.address,mercy.abi);
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

function getSects(wallet,cb){
  let contract=getMercyContract();
  contract.methods.getSects().call({from:wallet},cb);
}

function getSectById(wallet,id,cb){
  let contract=getMercyContract();
  contract.methods.getSectById(id).call({from:wallet},cb);
}

function getTotalCost(wallet,amount,cb){
  let contract=getExchangeContract();
  contract.methods.getTotalCost(amount).call({from:wallet},cb);
}

function isUsernameTaken(wallet, username, cb){
  let contract=getMercyContract();
  let web3 = require('web3-utils');
  contract.methods.isUsernameTaken(web3.asciiToHex(username)).call({from:wallet},cb);
}

function buyToken(wallet, amount,value, cb) {
  let contract = getExchangeContract();
  return contract.methods.buy(amount).send({value: value, from: wallet}).on('confirmation', (c,r)=>{
    if(c===REQUIRED_CONFIRMATION){
      cb(r);
    }
  });
}

function sellToken(wallet, amount, cb) {
  let contract = getExchangeContract();
  return contract.methods.sell(amount).send({from: wallet}).on('confirmation', (c,r)=>{
    if(c===REQUIRED_CONFIRMATION){
      cb(r);
    }
  });
}

function approve(wallet, amount, cb) {
  let contract = getIncenseContract();
  let {address} = require('./config/MercyContract');
  return contract.methods.increaseApproval(address, amount).send({from: wallet}).on('confirmation', (c,r)=>{
    if(c===REQUIRED_CONFIRMATION){
      cb(r);
    }
  });
}

function listenBuyEvent(cb){
  getExchangeContract().events.BuyEvent({},cb);
}

function listenBidEvent(cb){
  getMercyContract().events.BidEvent({},cb);
}

function listenStartEvent(cb){
  getMercyContract().events.StartEvent({},cb);
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
  return contract.methods.bid().send({from: wallet}).on('confirmation', (c,r)=>{
    if(c===REQUIRED_CONFIRMATION){
      cb(r);
    }
  });
}


function register(wallet, username, referral,sect, cb,err) {
  let web3 = require('web3-utils');
  let contract = getMercyContract();
  return contract.methods.register(web3.asciiToHex(username), web3.asciiToHex(referral),sect)
    .send({from: wallet}).on('confirmation', (c,r)=>{
      if(c===REQUIRED_CONFIRMATION){
        cb(r);
      }
    }).on('error',err);
}



// function restart(wallet, cb) {
//   let contract = getMercyContract();
//   return contract.methods.restart().send({from: wallet}).on('receipt', cb);
// }

function win(wallet, cb) {
  let contract = getMercyContract();
  return contract.methods.win().send({from: wallet}).on('confirmation', (c,r)=>{
    if(c===REQUIRED_CONFIRMATION){
      cb(r);
    }
  });
}

function getAllowance(wallet,cb){
  let contract=getIncenseContract();
  let {address} = require('./config/MercyContract');

  return contract.methods.allowance(wallet, address).call({from:wallet},cb);
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
  getSects:getSects,
  getSectById:getSectById,
  getAllowance:getAllowance,
  getTotalCost:getTotalCost,
  register: register,
  listenBuyEvent:listenBuyEvent,
  listenBidEvent:listenBidEvent,
  listenStartEvent:listenStartEvent,
  isUsernameTaken:isUsernameTaken,
  getWeb3:getWeb3,
  win: win,
  approve: approve
};
