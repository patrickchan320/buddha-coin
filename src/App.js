import React, {Component} from 'react';
import './App.css';
import PageHeader from './PageHeader';
import lang from './lang';
import smart from './web3/smartContract.js';
import {Button} from 'react-bootstrap';
import Big from "big.js";
import Modal from 'react-modal';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: '',
      balance: 0,
      modalIsOpen: false,
      started: false,
      buy: '',
      endTime: 0,
      buyWei: 0,
      errorMessage:'',
      username: '',
      sellWei: 0,
      loggedIn: false,
      sell: '',
      lastBidder: '',
      pot: 0
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    smart.getWallet((err, acc) => {
      this.setState({wallet: acc[0]});
      let wallet = acc[0];
      smart.getGameStatus(wallet, (err, res) => {
        if (!res) {
          this.info(lang.t('main_game_status_error'));
          return;
        }
        let web3 = require('web3-utils');
        let uname = web3.hexToAscii(res.currentUserName).replace(/\u0000/g, '');

        // console.log('Username: "' + uname + '"' + ' ' + uname.length);
        this.setState({
          endTime: parseInt(res.gameEndTime, 10),
          started: res.isGameStarted,
          username: uname,
          loggedIn: uname.length > 0,
          lastBidder: res.lastBidderUserName,
          pot: parseFloat(res.gamePot)
        });
      });
      smart.getBalance(wallet, (err, res) => {
        this.setState({balance: res});
      });
      smart.getBuyPrice(wallet, (err, res) => {
        if(!res){
          this.info(lang.t('main_price_error'));
          return;
        }
        let wei = new Big(res);
        let ether = wei.div('1e+18').toPrecision(1) + '';
        this.setState({buy: ether, buyWei: res});
      });
    });
  }

  info(msg) {
    this.setState({errorMessage:msg});
    this.openModal();
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }
  componentDidMount() {
  }

  onBid() {
    smart.bid(this.state.wallet, (err, res) => {
      this.info(lang.t('main_thank'));
      smart.getGameStatus(this.state.wallet, (err, res) => {
      });
    });
  }


  render() {
    return (
      <div className="App">
        <PageHeader buy={this.state.buy} balance={this.state.balance} endTime={this.state.endTime}
                    started={this.state.started} loggedIn={this.state.loggedIn} username={this.state.username}/>
        <p className="main-content">
          <div className="jumbo">{lang.t('main_pot_intro')}</div>
          <div className="main-pot">{lang.t('main_pot', {pot: this.state.pot})}</div>
          <Button className="contribute-btn" onClick={() => {
            this.onBid();
          }}><img className="header-icon" src={require('./images/inc.png')}
                  alt={lang.t('icon_inc')}/> {lang.t('main_contribute')}</Button>
        </p>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="modal-dialog">

          <div style={{display:'flex'}}>
                <div><img src={require('./images/staff-dialogue.png')} className="dialog-image"/></div>
          <div className="dialog-message">{this.state.errorMessage}</div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
