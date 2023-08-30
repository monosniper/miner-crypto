import React from 'react';
import {observer} from "mobx-react-lite";
import store from "../store";

const Stats = () => {
    return (
	<div className="stats">
	    <div className="stats__item">Checked: {store.checks}</div>
	    <div className="stats__item">Found: {store.founds}</div>
	</div>
    );
};

export default observer(Stats);