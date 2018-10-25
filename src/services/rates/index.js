const axios = require('axios');
const rates = {}
const redisClient = require('../../redis')

rates.currencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']

/**
 * @description Retorna a URL para requisição da API de cotação.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com>
 * @param {String} key
 * @returns {String}
 */
const openExchangesLast = key => 
    `https://openexchangerates.org/api/latest.json?app_id=${key}&show_alternative=true&symbols=${rates.currencies.toString()}`

/**
 * @description Atualiza a cotação das moedas, persistindo elas através do redis.
 * @author Leonardo Tozato <leo.muniztozato@gmail.com> 
 */
rates.updateRates = () => {
    axios.get(openExchangesLast(process.env.API_KEY))
        .then(res => {
            let currentRates = res.data.rates
            for(let key in currentRates){
                redisClient.set(key, currentRates[key])
            }
        })
        .catch(error => {
            throw error
        })
}

module.exports = rates