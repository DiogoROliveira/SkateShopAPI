import { getToken } from "../token/token.js";
import { getProductListFilter, getProductFilter } from "../utils/filters/productFilter.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialscore/materialsitems`;

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

export const getAllProducts = async () => {
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
        const productsList = response.items;
        const formattedData = getProductListFilter(productsList);

        return formattedData;
    } catch (error) {
        console.error("Error fetching list of product details:", error.message);
    }
};

export const getProductByKey = async (productKey) => {
    try {
        const token = await getToken();
        const apiURL = `${baseURL}/${productKey}`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const productData = await fetchData(apiURL, options);
        const formattedData = getProductFilter(productData);

        return formattedData;
    } catch (error) {
        console.error("Error fetching product details:", error.message);
    }
};
