import React from 'react';

const Header = () => {
    return (
	<div className="header">
	    <div className="header__left">
		<div className="header__icon" style={{backgroundImage: 'url(/icons/miner.svg)'}}></div>
		<div className="header__title">Miner</div>
	    </div>
	    <div className="header__right">
		<div className="header-balance">
		    <div className="header-balance__text">Balance, USDT</div>
		    <div className="header-balance__value">$250,235.62</div>
		</div>
	    </div>
	</div>
    );
};

export default Header;