import React, {useEffect} from 'react';
import Coins from "./Coins";
import Panel from "./Panel";
import Stats from "./Stats";
import swal from "@sweetalert/with-react/dist/sweetalert";
import store from "../store";
import {observer} from "mobx-react-lite";
import ScrollToBottom from 'react-scroll-to-bottom';
import Balance from "./Balance";

const Miner = () => {
    useEffect(() => {
	if(store.status === store.STATUS_START) {
	    if(!Object.entries(store.coins).filter(([name, coin]) => coin.active).length) {
		swal(
		    <div>
			<p>You must select at least one coin</p>
		    </div>
		)
		store.stop()
	    }
	}
    }, [store.status])

    return (
	<div className={'wrapper'}>
	    <Stats />
	    <div className="main">
		<div className="main__item">
		    <ScrollToBottom className="log-box">
			{store.checks_log.map((row, i) => <div className="row" key={'soft-row-'+i}>{row}</div>)}
		    </ScrollToBottom>
		</div>
		<div className="main__item">
		    <ScrollToBottom className="log-box">
			{store.soft_log.map((row, i) => <div className="row" key={'soft-row-'+i}>{row}</div>)}
		    </ScrollToBottom>
		</div>
		<div className="main__item">
		    <ScrollToBottom className="log-box log-box_min">
			{store.founds_log.map((row, i) => <div className="row" key={'soft-row-'+i}>{row}</div>)}
		    </ScrollToBottom>
		</div>
		<div className="main__item">
		    <Balance />
		</div>
	    </div>
	    <Coins />
	    <Panel />
	</div>
    );
};

export default observer(Miner);