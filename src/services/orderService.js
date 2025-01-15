import { getToken } from "../token/token.js";
import { getOrderListFilter, getOrderFilter, postOrderFilter } from "../utils/filters/orderFilter.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/sales/orders`;

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

export const getAllOrders = async () => {
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
        const ordersList = response.items;
        const formattedData = getOrderListFilter(ordersList);

        return formattedData;
    } catch (error) {
        console.error("Error fetching list of order details:", error.message);
    }
};

export const getOrderById = async (orderId) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}/${orderId}`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const orderData = await fetchData(apiURL, options);
        const formattedData = getOrderFilter(orderData);

        return formattedData;
    } catch (error) {
        console.error("Error fetching list of order details:", error.message);
    }
};

export const postOrder = async (orderBody) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}`;

        const formattedData = postOrderFilter(orderBody);

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
        console.error("Error posting order details:", error.message);
    }
};
