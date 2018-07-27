import React, {Component} from 'react';
import './App.css';
import PageHeader from './PageHeader';
import lang from './lang';
import smart from './web3/smartContract.js';
import {Button, FormControl} from 'react-bootstrap';
import Big from "big.js";
import Modal from 'react-modal';

class App extends Component {
  constructor(props) {
    super(props);
    let parts=window.location.href.split('/');

    this.state = {
      wallet: '',
      balance: 0,
      modalIsOpen: false,
      showRegister: false,
      showMessage: true,
      showBuy: false,
      buyQuantity: 0,
      started: false,
      buy: '',
      endTime: 0,
      referrer:parts[parts.length-1],
      buyWei: 0,
      errorMessage: '',
      username: '',
      sellWei: 0,
      loggedIn: false,
      sell: '',
      lastBidder: '',
      registerReferer: '',
      registerUsername: '',
      pot: 0
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    document.title = lang.t('main_page_title');

  }

  doGetGameStatus(){
    smart.getGameStatus(this.state.wallet, (err, res) => {
      if (!res) {
        this.info(lang.t('main_game_status_error'));
        return;
      }
      let web3 = require('web3-utils');
      let uname = web3.hexToAscii(res.currentUserName).replace(/\u0000/g, '');
      let bn=web3.hexToAscii(res.lastBidderUserName).replace(/\u0000/g, '');
      this.setState({
        endTime: parseInt(res.gameEndTime, 10),
        started: res.isGameStarted,
        username: uname,
        loggedIn: uname.length > 0,
        lastBidder: bn,
        pot: parseFloat(res.gamePot)
      });
      this.header.forceUpdate();
    });
  }

  doGetBalance(){
    smart.getBalance(this.state.wallet, (err, res) => {
      this.setState({balance: res});
      this.header.forceUpdate();
    });

  }

  doGetBuyPrice(cb){
    smart.getBuyPrice(this.state.wallet, (err, res) => {
      if (!res) {
        this.info(lang.t('main_price_error'));
        return;
      }
      let wei = new Big(res);
      let ether = wei.div('1e+18').toPrecision(1) + '';
      this.setState({buy: ether, buyWei: res});
      if(cb){
        cb();
      }
    });
  }
  doGetSellPrice(cb){
    smart.getSellPrice(this.state.wallet, (err, res) => {
      if (!res) {
        this.info(lang.t('main_price_error'));
        return;
      }
      let wei = new Big(res);
      let ether = wei.div('1e+18').toPrecision(1) + '';
      this.setState({sell: ether, sellWei: res});
      if(cb){
        cb();
      }
    });
  }

  init() {
    smart.getWallet((err, acc) => {
      this.setState({wallet: acc[0]});
      this.doGetGameStatus();
      this.doGetBalance();
      this.doGetBuyPrice();
      this.doGetSellPrice();

    });
  }

  info(msg) {
    this.setState({showMessage: true, showBuy: false, showRegister: false, errorMessage: msg});
    this.openModal();
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({modalIsOpen: false, showRegister: false, errorMessage: '', showMessage: false, showBuy: false});
  }

  componentDidMount() {
    smart.getWeb3().eth.net.getNetworkType((err, netId) => {
      // console.log('' + netId);
      switch (netId) {
        case 'private':
          this.init();
        break;
        case 'mainnet':
        case 'rinkeby':
        case 'ropsten':
        default:
          this.info(lang.t('main_network_wrong'));
          return;
      }
    });
  }

  onBuy() {
    let q = parseInt(this.state.buyQuantity,10);
    if (q < 1) {
      return this.info(lang.t('main_quantity_error'));
    }
    this.info(lang.t('main_processing'));
    this.doGetBuyPrice(()=>{
      smart.buy(this.state.wallet, this.state.buyWei, q, (receipt) => {
        if (receipt) {
          setTimeout(()=>{
            this.doGetBalance();
            this.info(lang.t('main_thank'));
          },5000);
        }else{
          this.info(lang.t('main_sorry'));
        }
      });
    });
  }

  onRegister() {
    if (this.state.registerUsername.length === 0) {
      this.info(lang.t('main_register_empty_username'));
      return;
    }
    smart.register(this.state.wallet, this.state.registerUsername, this.state.registerReferer, (receipt) => {
      this.info(lang.t('main_register_success'));
      setTimeout(()=>{
        this.doGetGameStatus();
      },5000);
    });
  }

  onUsernameChange(n) {
    this.setState({registerUsername: n});
  }

  onReferralChange(n) {
    this.setState({registerReferer: n});
  }

  onQuantityChange(n) {
    this.setState({buyQuantity: n});
  }

  onOpenBuy() {
    this.setState({showBuy: true});
    this.openModal();
  }

  onBid() {
    if (parseInt(this.state.balance,10) === 0) {
      this.onOpenBuy();
    } else {
      smart.getAllowance(this.state.wallet,(err,res)=>{
        if(res>0){
          this.bidAndRefresh();
        }else{
          this.info(lang.t('main_allow_approve'));
          smart.approve(this.state.wallet, this.state.balance, (receipt) => {
            setTimeout(() => {
              this.bidAndRefresh();
            }, 5000);
          });
        }
      });

    }
  }

  bidAndRefresh(){
    this.info(lang.t('main_allow_bid'));
    smart.bid(this.state.wallet, (receipt) => {
      this.info(lang.t('main_thank'));
      setTimeout(()=>{
        this.doGetGameStatus();
        this.doGetBalance();
      },5000);

    });
  }

  onOpenRegister() {
    this.setState({showRegister: true});
    this.openModal();
  }


  onOpenTime(){
    this.info(lang.t('main_explain_time'));
  }

  onOpenPrice(){
    let k=this;
    // this.doGetBuyPrice(()=>{
    //   k.doGetSellPrice(()=>{
        k.info(lang.t('main_explain_price',{sell:k.state.sell,buy:k.state.buy}));
      // });
    // });

  }

  render() {
    return (
      <div className="App">
        <PageHeader buy={this.state.buy} balance={this.state.balance} endTime={this.state.endTime}
                    started={this.state.started} loggedIn={this.state.loggedIn} username={this.state.username}
                    lastBidder={this.state.lastBidder}
                    onBuy={() => {
                      this.onOpenBuy();
                    }}
                    onTime={()=>{
                      this.onOpenTime();
                    }}
                    onPrice={()=>{
                      this.onOpenPrice();
                    }}
                    onRegister={() => {
                      this.onOpenRegister();
                    }} ref={ref=>{this.header=ref;}}/>
        <div className="main-content">
          <div className="jumbo">{lang.t('main_pot_intro')}</div>
          <div className="main-pot"><img src={require('./images/eth-big.png')} className="pot-icon"/>{lang.t('main_pot', {pot: this.state.pot})}</div>
          <div className="jumbo">{(this.state.lastBidder!==null&&this.state.lastBidder.length>0)?lang.t('main_bidder',{bidder:this.state.lastBidder}):''}</div>
          <Button className="contribute-btn" onClick={() => {
            this.onBid();
          }}><img className="header-icon" src={require('./images/inc.png')}
                  alt={lang.t('icon_inc')}/> {lang.t('main_contribute')}</Button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="modal-dialog">
          <div style={{display: 'flex'}}>
            <div><img src={require('./images/dialogue.png')} className="dialog-image"
                      alt={lang.t('main_dialogue_image')}/></div>
            {this.state.showRegister ? (<div className="dialog-register">
              <div>{lang.t('main_register_cta')}</div>
              <FormControl
                type="text"
                placeholder={lang.t('main_register_username')}
                onChange={(e) => {
                  this.onUsernameChange(e.target.value)
                }}
              /><FormControl
              type="text"
              placeholder={lang.t('main_register_refer')}
              value={this.state.referrer}
              onChange={(e) => {
                this.onReferralChange(e.target.value)
              }}
            /><Button onClick={() => {
              this.onRegister()
            }} className="contribute-btn">{lang.t('main_register')}</Button>
            </div>) : ''}
            {this.state.showMessage ? <div className="dialog-message">{this.state.errorMessage}</div> : ''}
            {this.state.showBuy ? (<div className="dialog-register">
              <div>{lang.t('main_buy_cta')}</div>
              <FormControl
                type="number"
                placeholder={lang.t('main_buy_quantity')}
                onChange={(e) => {
                  this.onQuantityChange(e.target.value)
                }}
              /><Button onClick={() => {
              this.onBuy()
            }} className="contribute-btn">{lang.t('main_buy')}</Button>
            </div>) : ''}
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
