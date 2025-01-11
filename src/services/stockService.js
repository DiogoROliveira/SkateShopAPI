import { getToken } from "../token/token.js";

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

function filterProductData(itemData) {
    // Extract necessary fields and format price
    const priceObject = itemData.materialsItemWarehouses ? itemData.materialsItemWarehouses[0].calculatedUnitCost : null;
    const formattedPrice = priceObject ? `${priceObject.amount}` : "0";

    // Return the filtered data
    const filteredData = {
        description: itemData.description || "N/A",
        complementaryDescription: itemData.complementaryDescription || "N/A",
        itemKey: itemData.itemKey || "N/A",
        price: formattedPrice,
        stock: itemData.materialsItemWarehouses ? itemData.materialsItemWarehouses[0].stockBalance : 0
    };
    return filteredData;
}

const filterStockData = (data) => {
    const filteredItems = data.items.map((item) => {
        const totalQuantity = item.materialsItemWarehouses
            .map((warehouse) => warehouse.stockBalance || 0)
            .reduce((acc, curr) => acc + curr, 0);

        const firstWarehouse = item.materialsItemWarehouses[0];

        return {
            itemKey: item.itemKey,
            id: item.id,
            name: item.description,
            description: item.complementaryDescription || "",
            quantity: totalQuantity,
            unit: item.baseUnit,
            price: firstWarehouse?.calculatedUnitCostAmount || 0,
        };
    });

    return filteredItems;
};

export const getStock = async () => {
    const token = await getToken();
    const apiURL = `${baseURL}/odata`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const data = await fetchData(apiURL, options);
    const filteredData = filterStockData(data);
    return filteredData;
};

export const getProductByKey = async (itemKey) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${itemKey}`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const data = await fetchData(apiURL, options);
        const formatedData = await filterProductData(data);
        return formatedData;
    } catch (error) {
        console.error("Failed to fetch product by key:", error.message);
        throw new Error(`Failed to fetch product by key '${itemKey}'. ${error.message}`);
    }
};

export const getProductById = async (id) => {
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

