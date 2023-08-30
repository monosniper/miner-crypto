import React from 'react';
import {AiFillQuestionCircle} from "react-icons/ai";
import { Tooltip } from 'react-tooltip'
import store from "../store";

const Header = () => {
    return (
	<div className={'header ' + (store.network() === 'Pro' ? "pro" : '')}>
	    <div className="header__left"></div>
	    <div className="header__center">
		{store.network()} network
	    </div>
	    <div className="header__right">
		{store.user.premium ? null : <AiFillQuestionCircle
		    data-tooltip-id="network"
		    data-tooltip-content="You are currently using the free network, it is strongly recommended to purchase the PRO version to increase the efficiency"
		    data-tooltip-place="left"
		/>}
		<Tooltip id="network" style={{maxWidth: 250, zIndex: 10}} />
	    </div>
	</div>
    );
};

export default Header;