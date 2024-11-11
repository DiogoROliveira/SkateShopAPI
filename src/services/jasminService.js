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

        const url = `${jasminBaseURL}/${jasminUser}/${jasminSub}/billing/invoices/odata`;
        
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
        

    } catch (error) {
        console.error('Erro ao buscar faturas:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getSaleItems(){
    try {
        const token = await getAccessToken();
        const url = `${jasminBaseURL}/${jasminUser}/${jasminSub}/salesCore/salesItems/extension/odata`;
        
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    }catch (error) {
        console.error('Erro ao buscar itens de venda:', error.response ? error.response.data : error.message);
        throw error;
    }
}


async function getCustomers() {
    try {
        const token = await getAccessToken();
        const url = `${jasminBaseURL}/${jasminUser}/${jasminSub}/salesCore/customerParties/odata`;

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Erro ao buscar clientes:', error.response.status, error.response.data);
        } else {
            console.error('Erro ao buscar clientes:', error.message);
        }
        throw error;
    }
}


module.exports = { getCustomer, getInvoices, getSaleItems, getCustomers };

