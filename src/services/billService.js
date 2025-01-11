import { getToken } from "../token/token.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/billing/invoices`;
const suplierURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/invoiceReceipt/processOrders`

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
    const token = await getToken();
    const apiURL = `${baseURL}/${id}`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    return await fetchData(apiURL, options);
};
