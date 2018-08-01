import React, {Component} from 'react';
import './App.css';
import PageHeader from './PageHeader';
import lang from './lang';
import smart from './smartContract.js';
import {Button, FormControl} from 'react-bootstrap';
import Big from "big.js";
import Modal from 'react-modal';
import i18next from 'i18next';
import config from './config/network';

class App extends Component {
  constructor(props) {
    super(props);
    let parts = window.location.href.split('/');

    this.state = {
      wallet: '',
      balance: 0,
      modalIsOpen: false,
      showRegister: false,
      showMessage: true,
      showBuy: false,
      showClaim: false,
      buyQuantity: 0,
      started: false,
      sects: [],
      buy: '',
      endTime: 0,
      referrer: parts[parts.length - 1],
      buyWei: 0,
      errorMessage: '',
      username: '',
      sellWei: 0,
      loggedIn: false,
      claimQuantity:0,
      sell: '',
      referrals: 0,
      bonus: 0,
      lastBidder: '',
      registerReferer: '',
      registerUsername: '',
      sectId:0,
      registerSect: 0,
      pot: 0
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setTitle();

  }

  setTitle() {
    document.title = lang.t('main_page_title');
  }

  doGetGameStatus() {
    smart.getGameStatus(this.state.wallet, (err, res) => {
      if (!res) {
        this.info(lang.t('main_game_status_error'));
        return;
      }

      let web3 = require('web3-utils');
      let uname = web3.hexToAscii(res.currentUserName).replace(/\u0000/g, '');
      let bn = web3.hexToAscii(res.lastBidderUserName).replace(/\u0000/g, '');

      this.setState({
        endTime: parseInt(res.gameEndTime, 10),
        started: res.isGameStarted,
        username: uname,
        loggedIn: uname.length > 0,
        lastBidder: bn,
        sectId: res.userSectId,
        bonus: res.referralBonus,
        referrals: res.userReferrals,
        pot: parseFloat(res.gamePot)
      });
      // console.log('callback of get game status '+uname+' '+(uname.length>0));
      this.header.forceUpdate();
    });
  }

  doGetBalance() {
    smart.getBalance(this.state.wallet, (err, res) => {
      this.setState({balance: res});
      this.header.forceUpdate();
    });
  }

  doGetSects() {
    smart.getSects(this.state.wallet, (err, res) => {
      let k = [];
      for (let i in res) {
        smart.getSectById(this.state.wallet, res[i], (err, res) => {
          res.name = require('web3-utils').hexToAscii(res.name).replace(/\u0000/g, '');
          k.push(res);
          this.setState({sects: k});
        });
      }
    })
  }

  doGetBuyPrice(cb) {
    smart.getBuyPrice(this.state.wallet, (err, res) => {
      if (!res) {
        this.info(lang.t('main_price_error'));
        return;
      }
      let wei = new Big(res);
      let ether = wei.div('1e+18').toPrecision(1) + '';
      this.setState({buy: ether, buyWei: res});
      if (cb) {
        cb();
      }
    });
  }

  doGetSellPrice(cb) {
    smart.getSellPrice(this.state.wallet, (err, res) => {
      if (!res) {
        this.info(lang.t('main_price_error'));
        return;
      }
      let wei = new Big(res);
      let ether = wei.div('1e+18').toPrecision(1) + '';
      this.setState({sell: ether, sellWei: res});
      if (cb) {
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
      this.doGetSects();
      if(config.wsEnabled){
        this.doListenBidEvent();
        this.doListenBuyEvent();
        this.doListenStartEvent();
      }

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
      if(netId===config.network){
        this.init();
      }else{
        this.info(lang.t('main_network_wrong'));
      }
    });
  }

  onBuy() {
    let q = parseInt(this.state.buyQuantity, 10);
    if (q < 1) {
      return this.info(lang.t('main_quantity_error'));
    }
    this.info(lang.t('main_processing'));
    smart.getTotalCost(this.state.wallet,q,(err,res) => {
      if(!res){
        return;
      }
      let wei = new Big(res);
      console.log(wei.toString());
      smart.buy(this.state.wallet, q,wei, (receipt) => {
        if (receipt) {
          setTimeout(() => {
            this.doGetBalance();
            this.info(lang.t('main_thank'));
          }, 5000);
        } else {
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
    if (0 === (this.state.registerSect)) {
      this.info(lang.t('main_register_sect'));
      return;
    }
    smart.isUsernameTaken(this.state.wallet,this.state.registerUsername,(err,res)=>{
      if(res){
        this.info('main_register_taken');
      }else{
        smart.register(this.state.wallet, this.state.registerUsername, this.state.registerReferer, this.state.registerSect, (receipt) => {
          this.info(lang.t('main_register_success'));
          setTimeout(() => {
            this.doGetGameStatus();
          }, 5000);
        }, (err) => {
          this.info(lang.t('main_transaction_cancel'));
        });
      }
    });

  }

  onUsernameChange(n) {
    this.setState({registerUsername: n});
  }

  onReferralChange(n) {
    this.setState({registerReferer: n});
  }

  onSectChange(n) {
    this.setState({registerSect: n});
  }

  onQuantityChange(n) {
    this.setState({buyQuantity: n});
  }

  onClaimQuantityChange(n){
    this.setState({claimQuantity: n});
  }

  onOpenBuy() {
    this.setState({showBuy: true});
    this.openModal();
  }

  onBid() {
    let now = new Date().getTime() / 1000;
    if (this.state.started && now > this.state.endTime) {
      if (this.state.lastBidder === this.state.username) {
        smart.win(this.state.wallet,(err,res)=>{
          this.info(lang.t('main_congrats'));
          setTimeout(()=>{this.doGetGameStatus();},5000);
        });
      }else{
        this.info(lang.t('main_not_winner'));
      }
    } else {
      if (parseInt(this.state.balance, 10) === 0) {
        this.onOpenBuy();
      } else {
        smart.getAllowance(this.state.wallet, (err, res) => {
          console.log('got allowance '+res+' '+err);
          if (res > 0) {
            this.bidAndRefresh();
          } else {
            this.info(lang.t('main_allow_approve'));
            console.log('going to approve '+this.state.balance);
            smart.approve(this.state.wallet, this.state.balance, (receipt) => {
              setTimeout(() => {
                this.bidAndRefresh();
              }, 5000);
            });
          }
        });
      }
    }
  }

  getBuyCost() {
    return this.state.buyQuantity * this.state.buy;
  }

  bidAndRefresh() {
    this.info(lang.t('main_allow_bid'));
    smart.bid(this.state.wallet, (receipt) => {
      this.info(lang.t('main_thank'));
      setTimeout(() => {
        this.doGetGameStatus();
        this.doGetBalance();
      }, 5000);

    });
  }

  onOpenRegister() {
    this.setState({showRegister: true});
    this.openModal();
  }


  onOpenTime() {
    this.info(lang.t('main_explain_time'));
  }

  onOpenPrice() {
    let k = this;
    this.doGetBuyPrice(() => {
      k.doGetSellPrice(() => {
        k.info(lang.t('main_explain_price', {sell: k.state.sell, buy: k.state.buy}));
      });
    });
  }

  doListenBidEvent() {
    smart.listenBidEvent((err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('got bid event');
      this.doGetGameStatus();
      this.info(lang.t('main_bid_event'));
    });
  }

  getPotInEth() {
    return new Big(this.state.sell * this.state.pot).toFixed(5);
  }

  doListenBuyEvent() {
    smart.listenBuyEvent((err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      // console.log('got buy event '+res);
      this.doGetBalance();
      this.info(lang.t('main_buy_event'));
    });
  }

  doListenStartEvent() {
    smart.listenBuyEvent((err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      this.doGetGameStatus();
      this.info(lang.t('main_start_event'));
    });
  }

  onOpenBonus() {
    this.setState({showClaim:true});
    this.openModal();

  }

  onOpenReferral() {
    this.info(lang.t('main_explain_referrals'));
  }

  onChangeLanguage(code) {
    i18next.changeLanguage(code);
    this.forceUpdate();
    this.setTitle();
  }

  getClaimCost(){
    return this.getConvertRate()*this.state.claimQuantity;
  }

  getConvertRate(){
    let id=this.state.sectId;
    for(let i in this.state.sects){
      if(this.state.sects[i].id===id){
        return this.state.sects[i].referralTokenRate;
      }
    }
    return 0;
  }

  render() {
    let sectSelect = this.state.sects.map((d) => <option value={d.id}>{lang.t('sect_' + d.name)}</option>);
    let languages = <span className="language-bar page-top"><span className="clickable" onClick={() => {
      this.onChangeLanguage('en')
    }}>{lang.t('lang_en')}</span><span className="clickable" onClick={() => {
      this.onChangeLanguage('zh')
    }}>{lang.t('lang_zh')}</span><span className="clickable" onClick={() => {
      this.onChangeLanguage('cn')
    }}>{lang.t('lang_cn')}</span></span>;
    languages = '';

    return (
      <div className="App">
        {languages}
        <PageHeader buy={this.state.buy} balance={this.state.balance} endTime={this.state.endTime}
                    started={this.state.started} loggedIn={this.state.loggedIn} username={this.state.username}
                    lastBidder={this.state.lastBidder} referrals={this.state.referrals} bonus={this.state.bonus}
                    onReferral={() => {
                      this.onOpenReferral()
                    }}
                    onBonus={() => {
                      this.onOpenBonus()
                    }}
                    onBuy={() => {
                      this.onOpenBuy();
                    }}
                    onTime={() => {
                      this.onOpenTime();
                    }}
                    onPrice={() => {
                      this.onOpenPrice();
                    }}
                    onRegister={() => {
                      this.onOpenRegister();
                    }} ref={ref => {
          this.header = ref;
        }}/>
        <div className="main-content">
          <div className="jumbo">{lang.t('main_pot_intro')}</div>
          <div className="main-pot"><img src={require('./images/eth-big.png')} alt={lang.t('main_pot_icon')}
                                         className="pot-icon"/>{lang.t('main_pot', {pot: this.getPotInEth()})}</div>
          <div
            className="jumbo">{(this.state.lastBidder !== null && this.state.lastBidder.length > 0) ? lang.t('main_bidder', {bidder: this.state.lastBidder}) : ''}</div>
          <Button className="form-item" onClick={() => {
            this.onBid();
          }}><img className="header-icon" src={require('./images/inc.png')}
                  alt={lang.t('icon_inc')}/> {lang.t('main_contribute')}</Button>
        </div>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="modal-dialog">
          <div style={{display: 'flex'}}>
            <div style={{height: '100%'}}><img src={require('./images/dialogue.png')} className="dialog-image"
                                               alt={lang.t('main_dialogue_image')}/></div>
            {this.state.showMessage ? <div className="dialog-message">
              <div className="dialog-message-content">{this.state.errorMessage}</div>
            </div> : ''}
            {this.state.showRegister ? (<div className="dialog-form">
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
              defaultValue={this.state.referrer}
              onChange={(e) => {
                this.onReferralChange(e.target.value)
              }}
            />
              <FormControl componentClass="select" placeholder={lang.t('')}
                           onChange={(e) => {
                             this.onSectChange(e.target.value)
                           }}>
                <option value="0">{lang.t('main_register_sect')}</option>
                {sectSelect}
              </FormControl>
              <Button onClick={() => {
                this.onRegister()
              }} className="form-item">{lang.t('main_register')}</Button>
            </div>) : ''}
            {this.state.showClaim?(<div className="dialog-form">
              <div>
                <div>{lang.t('main_claim_cta')}</div>
                <div>{lang.t('main_convert_rate', {rate: this.getConvertRate()})}</div>
                <FormControl
                  type="number"
                  placeholder={lang.t('main_claim_quantity')}
                  className="form-item"

                  onChange={(e) => {
                    this.onClaimQuantityChange(e.target.value)
                  }}
                /><Button onClick={() => {
                this.onBuy()
              }} className="form-item">{this.getClaimCost() > 0 ? lang.t('main_claim_cost', {cost: this.getClaimCost()}) : lang.t('main_claim')}</Button>
              </div>
            </div>) : ''}
            {this.state.showBuy ? (<div className="dialog-form">
              <div>
                <div>{lang.t('main_buy_cta')}</div>
                <div>{lang.t('main_buy_price', {buy: this.state.buy})}</div>
                <FormControl
                  type="number"
                  placeholder={lang.t('main_buy_quantity')}
                  className="form-item"
                  value={this.state.buyQuantity}
                  onChange={(e) => {
                    this.onQuantityChange(e.target.value)
                  }}
                /><Button onClick={() => {
                this.onBuy()
              }} className="form-item">{this.getBuyCost() > 0 ? lang.t('main_buy_cost', {cost: this.getBuyCost()}) : lang.t('main_buy')}</Button>
              </div>
            </div>) : ''}
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
