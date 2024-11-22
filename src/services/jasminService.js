// TODO logica das chamadas a API do jasmin

const axios = require("axios");
const { getAccessToken } = require("../utils/auth");
const { jasminBaseURL, jasminUser, jasminSub } = require("../config/jasminConfig");

async function getInvoices() {
    try {
        const token = await getAccessToken();

        const url = `${jasminBaseURL}/${jasminUser}/${jasminSub}/billing/invoices/odata`;

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error(
            "Erro ao buscar faturas:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

async function getSaleItems() {
    try {
        const token = await getAccessToken();
        const url = `${jasminBaseURL}/${jasminUser}/${jasminSub}/salesCore/salesItems/extension/odata`;

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error(
            "Erro ao buscar itens de venda:",
            error.response ? error.response.data : error.message
        );
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
            console.error("Erro ao buscar clientes:", error.response.status, error.response.data);
        } else {
            console.error("Erro ao buscar clientes:", error.message);
        }
        throw error;
    }
}

const fetchWithCredentials = async (relativeUrl, opts = {}) => {
    try {
        const token = await getAccessToken();
        const BASE_URL = `${jasminBaseURL}/${jasminUser}/${jasminSub}`;
        console.log("Requesting...", BASE_URL + relativeUrl);

        const form = opts.form ? JSON.stringify(opts.form) : undefined;

        return axios({
            url: BASE_URL + relativeUrl,
            method: opts.method || "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: form,
            ...opts,
        });
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

const postStockChange = async (relativeUrl, opts = {}) => {
    try {
        const token = await getAccessToken();
        const BASE_URL = `${jasminBaseURL}/${jasminUser}/${jasminSub}`;
        console.log("Requesting...", BASE_URL + relativeUrl);

        const form = opts.form ? JSON.stringify(opts.form) : undefined;

        return axios({
            url: BASE_URL + relativeUrl,
            method: opts.method || "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: form,
            ...opts,
        });
    } catch (error) {
        console.error("Error posting data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = {
    getInvoices,
    getSaleItems,
    getCustomers,
    fetchWithCredentials,
    postStockChange,
};
