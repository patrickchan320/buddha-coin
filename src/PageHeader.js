import React, {Component} from 'react';
import lang from './lang';
import utils from './utils';
import {Button} from 'react-bootstrap';

export default class PageHeader extends Component {

  shouldComponentUpdate(a,b){
    return true;
  }

  shouldTimerGo() {
    let now = new Date().getTime() / 1000;
    let t = (document.getElementById('remaining_time'));
    if (!this.props.started || this.props.endTime === 0) {

      if (t !== null) {
        t.innerHTML = lang.t('head_not_started');
      }
    } else if(this.props.endTime - now<0) {
      if(t!==null){
        t.innerHTML=lang.t('head_game_ended');
      }
    }else{
      this.onStartTimer();
    }
  }

  getShareLink(username) {
    return lang.t('share_link',{username: username});
  }

  intervalId = 0;

  onStartTimer() {
    if (this.intervalId !== 0) {
      window.clearInterval(this.intervalId);
    }
    let now = new Date().getTime() / 1000;

    if (this.props.endTime > now) {
      let t = document.getElementById('remaining_time');
      let k = this;
      this.intervalId = setInterval(function () {
        let now = new Date().getTime() / 1000;
        if(k.props.endTime - now>86400){
          return;
        }
        t.innerHTML = utils.renderRemainingTime(k.props.endTime - now);
      }, 1000);
    }
  }

  render() {
    this.shouldTimerGo();
    let balance = (<span className="clickable" onClick={this.props.onBuy}><img alt={lang.t('icon_inc')} className="header-icon"
                              src={require('./images/inc.png')}/>{lang.t('head_balance', {balance: this.props.balance})}
    </span>);
    let share = (<span className="clickable" onClick={this.props.onShare}><img alt={lang.t('icon_share')} className="header-icon"
                            src={require('./images/share.png')}/><span className="hidden-xs ">{this.getShareLink(this.props.username)}</span></span>);
    let login = (<span style={{position:'absolute',right:0,textAlign: 'right'}}><Button bsStyle="link"
                                                            onClick={this.props.onRegister}>{lang.t('head_register')}</Button></span>);

    let mid = this.props.loggedIn ? balance : '';
    let last = this.props.loggedIn ? share : login;
    let bonus=this.props.loggedIn?<span className="clickable" onClick={this.props.onBonus}><img alt={lang.t('icon_bonus')} className="header-icon"
                                                                                                src={require('./images/bonus.png')}/>{lang.t('head_bonus',{bonus:this.props.bonus})}</span>:'';
    let referrals=this.props.loggedIn?<span className="clickable" onClick={this.props.onReferral}><img alt={lang.t('icon_referrals')} className="header-icon"
                                                                                                       src={require('./images/referrals.png')}/>{lang.t('head_referrals',{referrals:this.props.referrals})}</span>:'';
    return (
      <div className="page-top">
        <span className="clickable" onClick={this.props.onTime}>
              <img className="header-icon" alt={lang.t('icon_time')} src={require('./images/time.png')}/><span id="remaining_time"></span>
        </span>
        <span className="clickable" onClick={this.props.onPrice}>
              <img className="header-icon" alt={lang.t('icon_eth')}
                   src={require('./images/eth.png')}/>{lang.t('head_price', {price: this.props.buy})}
            </span>
        {mid}

        {bonus}
        {referrals}
        {last}
      </div>);

  }
}