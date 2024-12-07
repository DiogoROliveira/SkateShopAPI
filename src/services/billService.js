import { getToken } from '../token/token.js';

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/billing/invoices`;

const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (!response || !response.ok) {
            const errorMessage = response ? await response.text() : 'No response from server';
            throw new Error(`Response Error: ${response?.status || 'unknown'} - ${errorMessage}`);
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
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    return await fetchData(apiURL, options);
};

export const getBill = async (company, document, year, month) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${company}/${document}/${year}/${month}`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    return await fetchData(apiURL, options);
};