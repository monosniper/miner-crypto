import {makeAutoObservable} from "mobx";
import generateWallet from "../utils/generateWallet";
import randomIntFromInterval from "../utils/randInt";

const API_URL = 'http://127.0.0.1:4444/api'
// const API_URL = 'http://38.180.45.163:4444/api'
const DEMO_TIME = 60 * 10 // 10 minutes

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

    balances_default = {
        btc: 0,
        usdt: 0,
        eth: 0,
        doge: 0,
        ton: 0,
    }

    balance_update_interval = null

    wallet = null
    price_default = null
    price_pro = null
    verification = null
    network_1 = null
    network_2 = null
    network_3 = null
    tg = null

    constructor() {
        makeAutoObservable(this)

        this.fetchSettings()
        this.fetchRates()

        let user = localStorage.getItem('user');

        if (user !== null) {
            this.user = JSON.parse(user)
            this.updateBalance()
        }
    }

    setRates(rates) {
        this.rates = rates
    }

    filtered_coins = () => Object.entries(this.coins).filter(([name, coin]) => coin.active)

    fetchSettings() {
        fetch(`${API_URL}/settings`).then(rs => rs.json()).then((rs) => {
            this.wallet = rs.wallet
            this.price_default = rs.price_default
            this.price_pro = rs.price_pro
            this.verification = rs.verification
            this.network_1 = rs.network_1
            this.network_2 = rs.network_2
            this.network_3 = rs.network_3
            this.tg = rs.tg
        })
    }

    fetchRates() {
        let cached_data = localStorage.getItem('crypto_rates');

        if (cached_data !== null) {
            this.setRates(JSON.parse(cached_data))
        } else {

            fetch("https://latest.currency-api.pages.dev/v1/currencies/usd.json").then(rs => rs.json()).then(rs => {
                Object.entries(this.rates).forEach(([name]) => {
                    this.rates[name].invert = 1 / rs.usd[name]
                    this.rates[name].value = rs.usd[name]
                })
            })
            // fetch(`https://rest.coinapi.io/v1/exchangerate/USD?invert=false`, {
            // headers: {
            //     'X-CoinAPI-Key': "12ED6CD1-F9C6-4ACD-9A54-BE189A35D059"
            // }
            // })
            // .then(rs => rs.json())
            // .then(rs =>{
            //     Object.entries(this.rates).forEach(([name]) => {
            // 	this.rates[name].value = rs.rates.find(rate => rate.asset_id_quote === name.toUpperCase()).rate
            //     })
            // })

            // setTimeout(() => {
            // fetch(`https://rest.coinapi.io/v1/exchangerate/USD?invert=true`, {
            //     headers: {
            // 	'X-CoinAPI-Key': "12ED6CD1-F9C6-4ACD-9A54-BE189A35D059"
            //     }
            // })
            //     .then(rs => rs.json())
            //     .then(rs =>{
            // 	Object.entries(this.rates).forEach(([name]) => {
            // 	    this.rates[name].invert = rs.rates.find(rate => rate.asset_id_quote === name.toUpperCase()).rate
            // 	})
            //
            // 	localStorage.setItem('cached_data', JSON.stringify(this.rates));
            //     })
            // }, 1000)
        }
    }

    setStatus(status) {
        this.status = status
    }

    start() {
        this.setStatus(this.STATUS_START)

        this.addLog(this.LOG_SOFT, "Process", new Date().toLocaleTimeString() + " Status: Started")

        if (this.filtered_coins().length) {
            this.connectCoins()
            this.startChecks()

            this.balance_update_interval = setInterval(() => {
                const url = `${API_URL}/users/${this.user.id}`
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

        if (this.user.isDemo) {
            setInterval(() => {
                if (this.status === this.STATUS_START) {
                    let demo = localStorage.getItem('demo');

                    if (demo) {
                        demo = parseInt(demo)

                        if (demo < DEMO_TIME) {
                            localStorage.setItem('demo', (demo) + 1);
                        } else {
                            const url = `${API_URL}/users/${this.user.id}`
                            fetch(url, {
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    isDemoExpired: true,
                                })
                            })
                            this.addLog("DEMO time is over")
                            this.stop()
                        }
                    } else {
                        localStorage.setItem('demo', 1);
                    }
                }
            }, 1000)
        }
    }

    stop() {
        this.setStatus(this.STATUS_STOP)

        this.addLog(this.LOG_SOFT, "Process", new Date().toLocaleTimeString() + " Status: Stopped")

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
                if (_this.status !== _this.STATUS_STOP) {
                    _this.addLog(_this.LOG_SOFT, name.toUpperCase(), "Connection: Established")

                    if (i < _this.filtered_coins().length - 1) {
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

        const getRandomCoin = () => this.filtered_coins()[Math.floor(Math.random() * this.filtered_coins().length)]

        function check([name]) {
            setTimeout(() => {
                if (_this.status !== _this.STATUS_STOP) {
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

                        const found = list.find(function (element) { // iterate through all elements
                            accumulatedChance += element.chance // accumulate the chances
                            return accumulatedChance >= rand // tests if the element is in the range and if yes this item is stored in 'found'
                        })

                        if (found) {
                            const amount = found.func()
                            const rate_amount = amount * _this.rates[name].value
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
        fetch(`${API_URL}/users/miner/${this.user.key}`)
            .then(rs => rs.json())
            .then((rs) => {
                this.user = rs
                if (!this.user.balance) {
                    this.user.balance = this.balances
                }
                this.balances = this.user.balance

                localStorage.setItem('user', JSON.stringify(this.user));
            });
    }

    logout() {
        localStorage.removeItem('user');
        this.user = null
        this.balances = this.balances_default
    }

    login(id) {
        return fetch(`${API_URL}/users/miner/${id}`)
            .then(rs => rs.json())
            .then((rs) => {
                if (rs) {
                    this.user = rs
                    if (!this.user.balance) {
                        this.user.balance = this.balances
                    }
                    this.balances = this.user.balance
                    localStorage.setItem('user', JSON.stringify(this.user));
                }
            });
    }

	getDemo() {
        return fetch(`${API_URL}/users`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'miner',
                    from_name: '',
                    premium: false,
                    isDemo: true,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(rs => rs.json())
            .then(({ key }) => this.login(key));
	}

    sendRefNotification(transaction_id, type) {
        const text = [
            "Покупка - " + type,
            "ID Транзакции: " + transaction_id,
            "Рефералка: " + this.user.from_name,
            "Ключ: " + this.user.key,
            "User ID: " + this.user.id,
        ]

        const bot_token = '6510018002:AAGZ16vGISteAE00-tBIlHXY_TPXQ3czII0';
        const chats = [
            269530936, // ravilto
            531897964, // vanya
        ]

        chats.forEach(chat_id => {
            fetch(`https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chat_id}&text=${text.join("%0A")}&parse_mode=HTML`)
        })
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new Store()