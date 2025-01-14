import { getToken } from "../token/token.js";
import { getClientFilter, getClientListFilter, postClientFilter } from "../utils/filters/clientFilter.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/salesCore/customerParties`;

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

export const getAllClients = async () => {
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
        const clientsList = response.items;
        const formattedData = getClientListFilter(clientsList);

        return formattedData;
    } catch (error) {
        console.error("Error fetching list of client details:", error.message);
    }
};

export const getClientByKey = async (clientKey) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}/${clientKey}`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const clientData = await fetchData(apiURL, options);
        const formattedData = getClientFilter(clientData);

        return formattedData;
    } catch (error) {
        console.error("Error fetching client details:", error.message);
    }
};

export const postClient = async (clientBody) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}`;

        const formattedData = postClientFilter(clientBody);

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
        console.error("Error posting client details:", error.message);
    }
};
