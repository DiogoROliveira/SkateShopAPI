import { getToken } from "../token/token.js";
import { getBillListFilter, getBillFilter, postReciptFilter, postBillFilter, postSuplierBillFilter} from "../utils/filters/billFilter.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/billing/invoices`;
const suplierURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/invoiceReceipt/invoices`;
const receiptURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/accountsReceivable/processOpenItems/generateReceipt`;

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
    try {
        const token = await getToken();
        const apiURL = `${baseURL}/odata`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const response = await fetchData(apiURL, options);
        const billsList = response.items;
        const formattedData = getBillListFilter(billsList);

        return formattedData;
    } catch (error) {
        console.error("Error fetching list of bill details:", error.message);
    }
};

export const getBillById = async (billId) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}/${billId}`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const billData = await fetchData(apiURL, options);
        const formattedData = getBillFilter(billData);

        return formattedData;
    } catch (error) {
        console.error("Error fetching bill details:", error.message);
    }
};

export const postRecipt = async (receiptData) => {
    try {
        const token = await getToken();
        const apiURL = `${receiptURL}`;

        const formattedData = postReciptFilter(receiptData);

        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
        };

        const response = await fetchData(apiURL, options);

        return response;
    } catch (error) {
        console.error("Error posting recipt details:", error.message);
    }
};

export const postBill = async (billData) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}`;

        const formattedData = postBillFilter(billData);

        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
        };

        const response = await fetchData(apiURL, options);

        return response;
    } catch (error) {
        console.error("Error posting bill details:", error.message);
    }
}

export const postSuplierBill = async (billData) => {
    try {
        const token = await getToken();
        const apiURL = `${suplierURL}`;

        const formattedData = postSuplierBillFilter(billData);

        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
        };

        const response = await fetchData(apiURL, options);

        return response;
    } catch (error) {
        console.error("Error posting bill details:", error.message);
    }
};