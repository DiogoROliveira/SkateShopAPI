import { getToken } from "../token/token.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/billing/invoices`;
const suplierURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/invoiceReceipt/invoices`;

const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (!response || !response.ok) {
            const errorMessage = response ? await response.text() : "No response from server";
            throw new Error(`Response Error: ${response?.status || "unknown"} - ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Request failed:", error.message);
        throw new Error("Service failure. Please check the URL and service.");
    }
};

export const getAllBills = async () => {
    const token = await getToken();
    const apiURL = `${baseURL}/odata`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    return await fetchData(apiURL, options);
};

export const createReceiptRequest = async (receiptData) => {
    try {
        // Obtenha o token de autenticação
        const authToken = await getAccessToken();

        // Construa a URL do endpoint
        const endpointUrl = `https://my.jasminsoftware.com/api/${process.env.TENANT}/${process.env.ORGANIZATION}/accountsReceivable/processOpenItems/generateReceipt`;

        // Faça a requisição para gerar o recibo
        const apiResponse = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(receiptData),
        });

        // Verifique se a resposta foi bem-sucedida
        if (!apiResponse.ok) {
            const responseError = await apiResponse.text();
            throw new Error(`Response error: ${apiResponse.status} - ${responseError}`);
        }

        // Retorne os dados da resposta
        return await apiResponse.json();
    } catch (err) {
        // Log de erro
        console.error("Error generating receipt:", err.message);
        throw new Error("Failed to generate the invoice receipt. Please check the service and URL.");
    }
};

export const postBill = async (bill) => {
    const token = await getToken();
    const apiURL = `${baseURL}`;
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bill),
    };

    return await fetchData(apiURL, options);
};

export const postSuplierBill = async (bill) => {
    const token = await getToken();
    const apiURL = `${suplierURL}`;
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bill),
    };

    return await fetchData(apiURL, options);
};

export const getBillById = async (id) => {
    const authToken = await getToken();

    const requestUrl = `${baseURL}/${id}`;

    try {
        const apiResponse = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Verifique se a resposta foi bem-sucedida
        if (!apiResponse || !apiResponse.ok) {
            const responseError = apiResponse ? await apiResponse.text() : 'No server response';
            throw new Error(`Response error: ${apiResponse?.status || 'unknown'} - ${responseError}`);
        }

        // Retorne os dados da resposta
        return await apiResponse.json();
    } catch (err) {
        // Tratamento de erro
        console.error("Error fetching specific invoice:", err.message);
        throw new Error("Failed to fetch specific invoice. Please check the service and URL.");
    }
};