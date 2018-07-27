import React, {Component} from 'react';
import lang from './lang';
import utils from './utils';
import {Grid,Row,Col} from 'react-bootstrap';

export default class PageHeader extends Component {
    constructor(props){
        super(props);
        console.log('PageHeader '+props.loggedIn+' '+this.props.loggedIn);
    }
    componentDidMount() {
        if (!this.props.started || this.props.endTime===0) {
            let t = (document.getElementById('remaining_time'));
            if (t !== null) {
                t.innerHTML = lang.t('head_not_started');
            }
        } else {
            this.onStartTimer();
        }
        console.log('component mount '+this.props.loggedIn);
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
                t.innerHTML = k.getRemainingTime(k.props.endTime - now);
            }, 1000);
        }
    }

    render() {
        let balance = (<Col xs={4} md={2} lg={2} sm={3}><img alt={lang.t('icon_inc')} className="header-icon" src={require('./images/inc.png')}/>{lang.t('head_balance', {balance: this.props.balance})}</Col>);
        let share = (<Col xs={4} md={2} lg={2} sm={3}><img  alt={lang.t('icon_share')} className="header-icon" src={require('./images/share.png')}/>{this.props.share}</Col>);
        let login = (<Col xs={2} md={2} lg={2} sm={3} style={{textAlign:'right'}}><a href="#register">{lang.t('head_register')}</a></Col>);
        let space = (<Col xs={0} md={2} lg={2} sm={0}/>);

        let mid=this.props.loggedIn ? balance: space;
        let last=this.props.loggedIn?share:login;
        // console.log(this.props.loggedIn+' <---' +JSON.stringify(this.props));
        return (
            <div className="page-top">
                <Grid>
                    <Row>
                        <Col xs={4} md={2} lg={2} sm={3}>
                            <img className="header-icon" alt={lang.t('icon_time')} src={require('./images/time.png')}/><span
                            id="remaining_time">{utils.renderRemainingTime(this.props.endTime)}</span>
                        </Col>
                        <Col xs={4} md={2} lg={2} sm={3}>
                            <img className="header-icon" alt={lang.t('icon_eth')}
                                 src={require('./images/eth.png')}/>{lang.t('head_price', {price: this.props.buy})}
                        </Col>
                        {mid}
                        {last}
                    </Row>
                </Grid>
            </div>);

    }
}