import React from 'react';
import store from "../store";

const Footer = () => {
    return (
	<div className={'footer'}>
	    <div className="footer__left" onClick={() => store.logout()}>
		<img src="./img/logout.svg"/>
	    </div>
	    <div className="footer__right">
		ver. e0.0.1
	    </div>
	</div>
    );
};

export default Footer;