// TODO logica das chamadas a API do jasmin

const axios = require('axios');
const { getAccessToken } = require('../utils/auth');
const { jasminBaseURL } = require('../config/jasminConfig');

// FUNC EXEMPLO
async function getCustomer(customerId) {
    const token = await getAccessToken();
    return axios.get(`${jasminBaseURL}/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

module.exports = { getCustomer };