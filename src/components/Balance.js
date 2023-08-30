import React from 'react';
import {observer} from "mobx-react-lite";
import store from "../store";

const Balance = () => {
    return (
	<div className="balance">
	    <div className="balance__item">BTC: {store.balances['btc'].toFixed(4)}</div>
	    <div className="balance__item">USDT: {store.balances['usdt'].toFixed(4)}</div>
	    <div className="balance__item">ETH: {store.balances['eth'].toFixed(4)}</div>
	    <div className="balance__item">DOGE: {store.balances['doge'].toFixed(4)}</div>
	    <div className="balance__item">TON: {store.balances['ton'].toFixed(4)}</div>
	    <div className="balance__item">TOTAL: ~${store.getTotalBalance().toFixed(1)}</div>
	</div>
    );
};

export default observer(Balance);