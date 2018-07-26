import React from 'react';
import Web3 from 'web3';
import './App.css';

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
    }
}

function getIncenseContract() {
    let web3 = getWeb3();
    let {abi, address} = require('./IncenseContract');
    return new web3.eth.Contract(abi, address);
}

function getMercyContract() {
    let web3 = getWeb3();
    let {abi, address} = require('./MercyContract');
    return new web3.eth.Contract(abi, address);
}


function getBalance(wallet,cb) {
    let contract = getIncenseContract();
    contract.methods.balanceOf(wallet).call({from: wallet}, cb);
}

function getSellPrice(wallet,cb) {
    let contract = getIncenseContract();
    contract.methods.getSellPrice().call({from: wallet}, cb);
}

function getBuyPrice(wallet,cb) {
    let contract = getIncenseContract();
    contract.methods.getBuyPrice().call({from: wallet}, cb);
}

function getUserStatus(wallet,cb) {
    let contract = getIncenseContract();
    contract.methods.getUserStatus().call({from: wallet}, cb);
}


function buyInc(wallet,buyWei,amount, cb) {
    let contract = getIncenseContract();
    contract.methods.buy().send({value: buyWei * amount, from: wallet}).on('receipt', cb);
}

function sellInc(wallet,amount, cb) {
    let contract = getIncenseContract();
    contract.methods.sell(amount).send({from: wallet}).on('receipt', cb);
}

function approve(wallet,amount, cb) {
    let contract = getIncenseContract();
    let {address} = require('./MercyContract');
    contract.methods.approve(address, amount).send({from: wallet}).on('receipt', cb);
}

function getGameEndTime(wallet,cb) {
    let contract = getMercyContract();
    contract.methods.getEndTime().call({from: wallet}, cb);
}

function getPot(wallet,cb) {
    let contract = getMercyContract();
    contract.methods.getPot().call({from: wallet}, cb);
}

function isGameEnded(wallet,cb) {
    let contract = getMercyContract();
    contract.methods.isGameEnded().call({from: wallet}, cb);
}

function bid(wallet,cb) {
    let contract = getMercyContract();
    contract.methods.bid().send({from: wallet}).on('receipt', cb);
}


function register(wallet,username, referral, cb) {
    let web3 = require('web3-utils');
    let contract = getMercyContract();
    contract.methods.register(web3.asciiToHex(username), web3.asciiToHex(referral))
        .send({from: wallet}).on('receipt', cb);
}


function restart(wallet,cb) {
    let contract = getMercyContract();
    contract.methods.restart().send({from: wallet}).on('receipt', cb);
}

function win(wallet,cb) {
    let contract = getMercyContract();
    contract.methods.win().send({from: wallet}).on('receipt', cb);
}


function getGameStatus(wallet,cb){
    let contract = getMercyContract();
    contract.methods.getGameStatus().call({from: wallet}, cb);
}


export default {
    getWallet: getWallet,
    getGameStatus:getGameStatus,
    getUserStatus:getUserStatus,
    bid: bid,
    approve: approve
};
