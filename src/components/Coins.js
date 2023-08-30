import React from 'react';
import {Tooltip} from "react-tooltip";
import {observer} from "mobx-react-lite";
import store from "../store"

const Coins = () => {
    return (
	<div className="coins">
	    <div className={"coin "+(store.coins["btc"].active ? 'active' : '')}
		 onClick={() => store.toggleCoin('btc')}
		 data-tooltip-id="btc"
		 data-tooltip-content="Bitcoin"
		 data-tooltip-place="bottom"
	    >
		<img src="./img/btc.svg"/>
	    </div>
	    <div className={"coin "+(store.coins["usdt"].active ? 'active' : '')}
		 onClick={() => store.toggleCoin('usdt')}
		 data-tooltip-id="usdt"
		 data-tooltip-content="Tether"
		 data-tooltip-place="bottom"
	    >
		<img src="./img/usdt.svg"/>
	    </div>
	    <div className={"coin coin_img-min "+(store.coins["eth"].active ? 'active' : '')}
		 onClick={() => store.toggleCoin('eth')}
		 data-tooltip-id="eth"
		 data-tooltip-content="Ethereum"
		 data-tooltip-place="bottom"
	    >
		<img src="./img/eth.svg"/>
	    </div>
	    <div className={"coin "+(store.coins["doge"].active ? 'active' : '')}
		 onClick={() => store.toggleCoin('doge')}
		 data-tooltip-id="doge"
		 data-tooltip-content="DogeCoin"
		 data-tooltip-place="bottom"
	    >
		<img src="./img/doge.svg"/>
	    </div>
	    <div className={"coin "+(store.coins["ton"].active ? 'active' : '')}
		 onClick={() => store.toggleCoin('ton')}
		 data-tooltip-id="ton"
		 data-tooltip-content="TON"
		 data-tooltip-place="bottom"
	    >
		<img src="./img/ton.svg"/>
	    </div>
	    <Tooltip style={{zIndex: 10}} id="btc" />
	    <Tooltip style={{zIndex: 10}} id="usdt" />
	    <Tooltip style={{zIndex: 10}} id="eth" />
	    <Tooltip style={{zIndex: 10}} id="doge" />
	    <Tooltip style={{zIndex: 10}} id="ton" />
	</div>
    );
};

export default observer(Coins);