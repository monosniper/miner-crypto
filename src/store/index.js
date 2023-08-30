import {makeAutoObservable} from "mobx";
import generateWallet from "../utils/generateWallet";
import randomIntFromInterval from "../utils/randInt";

class Store {
    user = null

    status = "stop"

    checks = 0
    founds = 0

    network = () => this.user?.premium ? 'Pro' : 'Free'

    checks_log = []
    soft_log = []
    founds_log = []

    coins = {
	btc: {
	    active: false,
	    connected: false,
	},
	usdt: {
	    active: false,
	    connected: false,
	},
	eth: {
	    active: false,
	    connected: false,
	},
	doge: {
	    active: false,
	    connected: false,
	},
	ton: {
	    active: false,
	    connected: false,
	},
    }

    STATUS_STOP = "stop"
    STATUS_START = "start"

    LOG_CHECKS = "checks"
    LOG_SOFT = "soft"
    LOG_FOUNDS = "founds"

    rates = {
	btc: {
	    value: 0,
	    invert: 0,
	},
	usdt: {
	    value: 0,
	    invert: 0,
	},
	eth: {
	    value: 0,
	    invert: 0,
	},
	doge: {
	    value: 0,
	    invert: 0,
	},
	ton: {
	    value: 0,
	    invert: 0,
	},
    }

    balances = {
	btc: 0,
	usdt: 0,
	eth: 0,
	doge: 0,
	ton: 0,
    }

    balance_update_interval = null

    constructor() {
	makeAutoObservable(this)

	this.fetchRates()

	let user = localStorage.getItem('user');

	if (user!==null) {
	    this.user = JSON.parse(user)
	    this.updateBalance()
	}
    }

    setRates(rates) {
	this.rates = rates
    }

    filtered_coins = () => Object.entries(this.coins).filter(([name, coin]) => coin.active)

    fetchRates() {
	let cached_data = localStorage.getItem('cached_data');

	if (cached_data!==null) {
	    this.setRates(JSON.parse(cached_data))
	} else {
	    fetch(`https://rest.coinapi.io/v1/exchangerate/USD?invert=false`, {
		headers: {
		    'X-CoinAPI-Key': "12ED6CD1-F9C6-4ACD-9A54-BE189A35D059"
		}
	    })
		.then(rs => rs.json())
		.then(rs =>{
		    Object.entries(this.rates).forEach(([name]) => {
			this.rates[name].value = rs.rates.find(rate => rate.asset_id_quote === name.toUpperCase()).rate
		    })
		})

	    setTimeout(() => {
		fetch(`https://rest.coinapi.io/v1/exchangerate/USD?invert=true`, {
		    headers: {
			'X-CoinAPI-Key': "12ED6CD1-F9C6-4ACD-9A54-BE189A35D059"
		    }
		})
		    .then(rs => rs.json())
		    .then(rs =>{
			Object.entries(this.rates).forEach(([name]) => {
			    this.rates[name].invert = rs.rates.find(rate => rate.asset_id_quote === name.toUpperCase()).rate
			})

			localStorage.setItem('cached_data', JSON.stringify(this.rates));
		    })
	    }, 1000)
	}
    }

    setStatus(status) {
	this.status = status
    }

    start() {
	this.setStatus(this.STATUS_START)

	this.addLog(this.LOG_SOFT, "Process", new Date().toLocaleTimeString()+" Status: Started")

	if(this.filtered_coins().length) {
	    this.connectCoins()
	    this.startChecks()

	    this.balance_update_interval = setInterval(() => {
		const url = `http://130.0.233.208:4444/api/users/${this.user.id}`
		fetch(url, {
		    method: 'PATCH',
		    headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		    },
		    body: JSON.stringify({
			balance: this.balances
		    })
		})
	    }, 1000)
	}
    }

    stop() {
	this.setStatus(this.STATUS_STOP)

	this.addLog(this.LOG_SOFT, "Process", new Date().toLocaleTimeString()+" Status: Stopped")

	clearInterval(this.balance_update_interval)
    }

    addLog(name, type, text) {
	const names = {
	    [this.LOG_CHECKS]: this.checks_log,
	    [this.LOG_SOFT]: this.soft_log,
	    [this.LOG_FOUNDS]: this.founds_log,
	}

	names[name].push(`[${type}] ${text}`)
    }

    connectCoins() {
	const _this = this
	let i = 0

	function connectCoin([name]) {
	    setTimeout(() => {
		if(_this.status !== _this.STATUS_STOP) {
		    _this.addLog(_this.LOG_SOFT, name.toUpperCase(), "Connection: Established")

		    if(i < _this.filtered_coins().length-1) {
			i++
			connectCoin(_this.filtered_coins()[i])
		    }
		}
	    }, 500)
	}

	connectCoin(this.filtered_coins()[i])
    }

    addCheck() {
	this.checks += 1
    }

    addFound() {
	this.founds += 1
    }

    startChecks() {
	const _this = this

	const getRandomCoin = () => this.filtered_coins()[Math.floor(Math.random()*this.filtered_coins().length)]

	function check([name]) {
	    setTimeout(() => {
		if(_this.status !== _this.STATUS_STOP) {
		    _this.addLog(_this.LOG_CHECKS, name.toUpperCase(), "Wallet Check: " + generateWallet())

		    _this.addCheck()

		    function low() {
			// $ 1 - 15
			return randomIntFromInterval(10, 150) / 10
		    }

		    function middle() {
			// $ 15 - 100
			return randomIntFromInterval(150, 1000) / 10
		    }

		    function high() {
			// $ 100 - 500
			return randomIntFromInterval(1000, 5000) / 10
		    }

		    function freeLow() {
			// $ 0.01 - 0.1
			return randomIntFromInterval(0.1, 1) / 10
		    }

		    function freeMiddle() {
			// $ 0.1 - 5
			return randomIntFromInterval(1, 50) / 10
		    }

		    const list = _this.user.premium ? [
			{chance: 0.1, func: low},
			{chance: 0.01, func: middle},
			{chance: 0.001, func: high}
		    ] : [
			{chance: 0.1, func: freeLow},
			{chance: 0.0002, func: freeMiddle},
		    ];

		    function callRandomFunction(list) {
			const rand = Math.random() // get a random number between 0 and 1
			let accumulatedChance = 0 // used to figure out the current

			const found = list.find(function(element) { // iterate through all elements
			    accumulatedChance += element.chance // accumulate the chances
			    return accumulatedChance >= rand // tests if the element is in the range and if yes this item is stored in 'found'
			})

			if( found ) {
			    const amount = found.func()
			    const rate_amount = amount*_this.rates[name].value
			    _this.addLog(_this.LOG_FOUNDS, name.toUpperCase(), `Found: ~$${amount} (${rate_amount})`)
			    _this.balances[name] += rate_amount
			    _this.addFound()
			}
		    }

		    callRandomFunction(list)

		    check(getRandomCoin())
		}
	    }, _this.user.premium ? 50 : 500)
	}

	check(getRandomCoin())
    }

    toggleCoin(coin) {
	this.coins[coin].active = !this.coins[coin].active
    }

    getTotalBalance() {
	let total = 0;

	Object.entries(this.balances).forEach(([name]) => {
	    total += this.balances[name] * this.rates[name].invert
	})

	return total;
    }

    updateBalance() {
	fetch(`http://130.0.233.208:4444/api/users/miner/${this.user.key}`)
	    .then(rs => rs.json())
	    .then((rs) => {
		this.user = rs
		if(!this.user.balance) {
		    this.user.balance = this.balances
		}
		this.balances = this.user.balance

		localStorage.setItem('user', JSON.stringify(this.user));
	    });
    }

    login(id) {
	return fetch(`http://130.0.233.208:4444/api/users/miner/${id}`)
	    .then(rs => rs.json())
	    .then((rs) => {
	    	this.user = rs
		if(!this.user.balance) {
		    this.user.balance = this.balances
		}
		localStorage.setItem('user', JSON.stringify(this.user));
	    });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Store()