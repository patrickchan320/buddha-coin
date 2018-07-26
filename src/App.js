import React, {Component} from 'react';
import './App.css';
import PageHeader from './PageHeader';
import lang from './lang';
import smart from './smartContract.js';
import {Button} from 'react-bootstrap';
import Big from "big.js";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wallet: '',
            balance: 0,
            started:false,
            buy: '',
            endTime: 0,
            buyWei: 0,
            username:'',
            sellWei: 0,
            loggedIn:false,
            sell: '',
            lastBidder:'',
            pot: 0
        };
        smart.getWallet((err, acc) => {
            this.setState({wallet: acc[0]});
            let wallet=acc[0];
            smart.getGameStatus(wallet,(err,res)=>{

                let web3 = require('web3-utils');
                let uname=web3.hexToAscii(res.currentUserName).replace(/\u0000/g, '');
                console.log(res);
                console.log('Username: "'+uname+'"'+ ' '+uname.length);
                this.setState({
                    endTime:parseInt(res.gameEndTime,10),
                    started:res.isGameStarted,
                    username: uname,
                    loggedIn: uname.length>0,
                    lastBidder: res.lastBidderUserName,
                    pot: parseFloat(res.gamePot)
                });
            });
            smart.getUserStatus(wallet,(err,res)=>{
                let wei=new Big(res.buyAt);
                let ether=wei.div('1e+18').toPrecision(1)+'';
                this.setState({buy: ether,buyWei:res.buyAt,balance:res.balance});
            });
        });
    }

    info(msg){

    }

    componentDidMount(){

    }

    onBid(){

        smart.bid(this.state.wallet,(err,res)=>{
            this.info(lang.t('main_thank'));
            smart.getGameStatus(this.state.wallet,(err,res)=>{

            });
        });
    }


    render() {
        return (
            <div className="App">
                <PageHeader buy={this.state.buy} balance={this.state.balance} endTime={this.state.endTime} started={this.state.started} loggedIn={this.state.loggedIn} username={this.state.username}/>
                <p className="main-content">
                    <div className="jumbo">{lang.t('main_pot_intro')}</div>
                    <div className="main-pot">{lang.t('main_pot',{pot:this.state.pot})}</div>
                    <Button className="contribute-btn" onClick={()=>{this.onBid();}}><img className="header-icon" src={require('./images/inc.png')} alt={lang.t('icon_inc')}/> {lang.t('main_contribute')}</Button>
                </p>
            </div>
        );
    }
}

export default App;
