import { getToken } from '../token/token.js';

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialscore/materialsitems`;

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

export const getStock = async () => {
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

export const getProductByKey = async (itemKey) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${itemKey}`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    return await fetchData(apiURL, options);
};

export const getProductById = async (id) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${id}`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    return await fetchData(apiURL, options);
};