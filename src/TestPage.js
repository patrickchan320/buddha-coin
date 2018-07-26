import React, { Component } from 'react';
import lang from './lang';
import Web3 from 'web3';
import './App.css';
import {Button,FormControl} from 'react-bootstrap';
import Big from 'big.js';

export default  class TestPage extends Component {

  constructor(props){
    super(props);
    this.state={wallet:'',balance:0,buy:'',endTime:0,buyWei:0,sellWei:0,sell:'',pot:0,username:'',referral:''};
    this.getWallet();
  }

  getWallet(){
    if (window.web3 && window.web3.currentProvider.isMetaMask) {
      window.web3.eth.getAccounts((error, accounts) => {
        this.setState({wallet: accounts[0]});
      });
    }else{
      alert(lang.t('test_wallet_not_available'));
    }
  }

  getWeb3() {
    let originalWeb3 = window.web3;
    if (originalWeb3) {
      return new Web3(originalWeb3.currentProvider);
    }
  }

  getIncenseContract(){
    let web3 = this.getWeb3();
    let {abi,address}=require('./IncenseContract');
    return new web3.eth.Contract(abi, address);
  }

  getMercyContract(){
    let web3 = this.getWeb3();
    let {abi,address}=require('./MercyContract');
    return new web3.eth.Contract(abi, address);
  }


  onGetINCBalance(){
    let contract = this.getIncenseContract();
    contract.methods.balanceOf(this.state.wallet).call({from:this.state.wallet},(err,res)=>{
      this.setState({balance: res});
    });
  }

  onGetINCSellPrice(){
    let contract = this.getIncenseContract();
    contract.methods.getSellPrice().call({from:this.state.wallet},(err,res)=>{
      let wei=new Big(res);
      let ether=wei.div('1e+18').toPrecision(1)+'';
      this.setState({sell: ether,sellWei:res});
    });
  }

  onGetINCBuyPrice(){
    let contract = this.getIncenseContract();
    contract.methods.getBuyPrice().call({from:this.state.wallet},(err,res)=>{
      let wei=new Big(res);
      let ether=wei.div('1e+18').toPrecision(1)+'';
      this.setState({buy: ether,buyWei:res});
    });
  }

  onBuyInc(amount){
    let contract = this.getIncenseContract();
    contract.methods.buy().send({value:this.state.buyWei*amount,from:this.state.wallet}).on('receipt',(err,res)=>{
      this.onViewINCBalance();
    });
  }

  onSellInc(amount){
    let contract = this.getIncenseContract();
    contract.methods.sell(amount).send({from:this.state.wallet}).on('receipt',(err,res)=>{
      this.onViewINCBalance();
    });
  }

  onApprove(amount){
    let contract = this.getIncenseContract();
    let {address}=require('./MercyContract');
    contract.methods.approve(address,amount).send({from:this.state.wallet}).on('receipt',(err,res)=>{
      alert('approved amount increased');
    });
  }

  onGetGameEndTime(){
    let contract = this.getMercyContract();
    contract.methods.getEndTime().call({from:this.state.wallet},(err,res)=>{
      this.setState({endTime:res});
      this.onStartTimer();
    });
  }

  onGetPot(){
    let contract = this.getMercyContract();
    contract.methods.getPot().call({from:this.state.wallet},(err,res)=>{
      this.setState({pot:res});
    });
  }
  onIsGameEnded(){
    let contract = this.getMercyContract();
    contract.methods.isGameEnded().call({from:this.state.wallet},(err,res)=>{
      alert('Game ended '+res);
    });
  }

  onError(err){
    console.log('err '+err);
  }

  onBid(){
    let contract = this.getMercyContract();
    contract.methods.bid().send({from:this.state.wallet}).on('error',this.onError).on('receipt',(err,res)=>{
      this.onGetGameEndTime();
    });
  }


  onRegister(){
    let web3=require('web3-utils');
    let contract = this.getMercyContract();
    contract.methods.register(web3.asciiToHex(this.state.username),web3.asciiToHex(this.state.referral)).send({from:this.state.wallet}).on('error',this.onError).on('receipt',(err,res)=>{
    });
  }


  onRestart(){
    let contract = this.getMercyContract();
    contract.methods.restart().send({from:this.state.wallet}).on('receipt',(err,res)=>{
      this.onGetGameEndTime();
      this.onGetPot();
    });
  }

  onWin(){
    let contract = this.getMercyContract();
    contract.methods.win().send({from:this.state.wallet}).on('receipt',(err,res)=>{
    });
  }

  intervalId=0;
  onStartTimer(){
    if(this.intervalId!==0){
      window.clearInterval(this.intervalId);
    }
    let now=new Date().getTime()/1000;

    if(this.state.endTime>now){
      let t=document.getElementById('remaining_time');
      let k=this;
      this.intervalId=setInterval(function(){
        let now=new Date().getTime()/1000;
        t.innerHTML=k.getRemainingTime(k.state.endTime-now);
      },1000);
    }
  }

  onUsernameChange(v) {
    this.setState({ username: v });
  }
  onReferralChange(v){
    this.setState({referral: v});
  }

  getRemainingTime(t){
    t=parseInt(t);
    if(t<0){
      return '00:00:00';
    }
    let h=parseInt((t-(t%3600))/3600);
    t%=3600;
    let m=parseInt((t-(t%60))/60);
    t%=60;
    if(h<10){h='0'+h;}
    if(m<10){m='0'+m;}
    if(t<10){t='0'+t;}
    return h+':'+m+':'+t;
  }
  render() {
    return (
      <div className="App">
        <div>{lang.t('test_balance_label')} {lang.t('test_balance',{balance:this.state.balance})}</div>
        <div>{lang.t('test_price_label')} {lang.t('test_price',{buy:this.state.buy,sell:this.state.sell})}</div>
        <div>{lang.t('test_pot')} {lang.t('test_pot_size',{pot:this.state.pot})}</div>
        <div>{lang.t('test_end')} <span id="remaining_time"></span></div>
            <div><Button onClick={()=>{this.onGetINCBalance()}} bsStyle="primary">{lang.t('test_get_balance')}</Button></div>
            <div><Button onClick={()=>{this.onGetINCBuyPrice()}} bsStyle="primary">{lang.t('test_get_buy_price')}</Button></div>
            <div><Button onClick={()=>{this.onGetINCSellPrice()}} bsStyle="primary">{lang.t('test_get_sell_price')}</Button></div>
            <div><Button onClick={()=>{this.onBuyInc(10)}} bsStyle="primary">{lang.t('test_buy')}</Button></div>
            <div><Button onClick={()=>{this.onSellInc(10)}} bsStyle="primary">{lang.t('test_sell')}</Button></div>
            <div><Button onClick={()=>{this.onApprove(10)}} bsStyle="primary">{lang.t('test_approve')}</Button></div>
            <div><FormControl
              type="text"
              placeholder="User name"
              onChange={(e)=>{this.onUsernameChange(e.target.value)}}
            /><FormControl
              type="text"
              placeholder="Referral"
              onChange={(e)=>{this.onReferralChange(e.target.value)}}
            /><Button onClick={()=>{this.onRegister()}} bsStyle="primary">{lang.t('test_register')}</Button></div>
            <div><Button onClick={()=>{this.onGetGameEndTime()}} bsStyle="primary">{lang.t('test_get_end_time')}</Button></div>
            <div><Button onClick={()=>{this.onGetPot()}} bsStyle="primary">{lang.t('test_get_pot')}</Button></div>
            <div><Button onClick={()=>{this.onBid()}} bsStyle="primary">{lang.t('test_bid')}</Button></div>
            <div><Button onClick={()=>{this.onIsGameEnded()}} bsStyle="primary">{lang.t('test_ended')}</Button></div>
            <div><Button onClick={()=>{this.onWin()}} bsStyle="primary">{lang.t('test_win')}</Button></div>
            <div><Button onClick={()=>{this.onRestart()}} bsStyle="primary">{lang.t('test_restart')}</Button></div>
      </div>
    );
  }
}


