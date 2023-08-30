import React, {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import {observer} from "mobx-react-lite";
import store from "./store";

const Login = () => {
    const [cookies, setCookie] = useCookies(['id']);

    useEffect(() => {
	// setCookie('id', 'test')
	console.log(cookies)
    }, [])

    const [id, setId] = useState('')
    const [showError, setShowError] = useState(false)

    const handleChangeId = e => setId(e.target.value)

    const login = () => {
	store.login(id).then(() => {
	    if(!store.user) {
		setShowError(true)
	    }
	})
    }

    return (
	<div className={"form"}>
	    <p>Enter your license key:</p>
	    {showError ? <p className="error">Invalid license key!</p> : null}
	    <input className={'field'} type="text" value={id} onChange={handleChangeId}/>
	    <button disabled={id.trim() === ''} className="btn" onClick={login}>Login</button>
	</div>
    );
};

export default observer(Login);