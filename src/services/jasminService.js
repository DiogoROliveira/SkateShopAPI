// TODO logica das chamadas a API do jasmin

const axios = require('axios');
const { getAccessToken } = require('../utils/auth');
const { jasminBaseURL, jasminUser, jasminSub } = require('../config/jasminConfig');

// FUNC EXEMPLO
async function getCustomer(customerId) {
    const token = await getAccessToken();
    return axios.get(`${jasminBaseURL}/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

async function getInvoices(){
    try {
        const token = await getAccessToken();
        console.log(token);

        const url = `${jasminBaseURL}/${jasminUser}/${jasminSub}/billing/invoices/odata`;
        console.log(url);
        const response = await axios.get(`${jasminBaseURL}/${jasminUser}/${jasminSub}/billing/invoices/odata`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);
        return response.data;
        

    } catch (error) {
        console.error('Erro ao buscar faturas:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { getCustomer };
module.exports = { getInvoices };