import { getToken } from "../token/token.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/purchases/orders`;

export const formatPurchaseOrderData = (orderData) => {
    return {
        id: orderData.id,
        documentNumber: orderData.documentNumber,
        supplierParty: orderData.supplierParty,
        orderDate: orderData.documentDate,
        totalAmount: orderData.totalAmount?.amount || 0,
        currency: orderData.totalAmount?.currency || "EUR",
        documentStatus: orderData.documentStatus?.description || "N/A",
    };
};

/*
{
  "sellerSupplierParty": "0020",
  "sellerSupplierPartyName": "FORN TABUAS SKATE",
  "documentLines": [
    {
      "purchasesItem": "DECKLARGE",
      "description": "Tabua Maple 8.0",
      "quantity": 5,
      "unitPrice": { 
        "amount": 40.0,
        "baseAmount": 40.0,
        "reportingAmount": 40.0
        },
      "unit": "UN"
    }
  ],
  "emailTo": "youremail@gmail.com"
}
*/

//
// JSON para POST
// {
//   "itemKey": "WHLSWHITE"
// }


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

export const getPurchaseOrders = async () => {
    const token = await getToken();
    const apiURL = `${baseURL}/odata`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const data = await fetchData(apiURL, options);
        return data.items.map(formatPurchaseOrderData);
    } catch (error) {
        console.error("Error fetching purchase orders:", error.message);
        throw error;
    }
};

export const getPurchaseOrderById = async (orderId) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${orderId}`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const orderData = await fetchData(apiURL, options);
        return formatPurchaseOrderData(orderData);
    } catch (error) {
        console.error("Error fetching purchase order by ID:", error.message);
        throw error;
    }
};

export const createPurchaseOrder = async (orderData) => {
    const token = await getToken();
    const apiURL = `${baseURL}`;

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    };

    try {
        const response = await fetch(apiURL, options);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to create purchase order: ${response.status} - ${errorMessage}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating purchase order:", error.message);
        throw error;
    }
};

export const deletePurchaseOrder = async (orderId) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${orderId}`;

    const options = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(apiURL, options);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to delete purchase order: ${response.status} - ${errorMessage}`
            );
        }

        return { message: "Purchase order deleted successfully" };
    } catch (error) {
        console.error("Error deleting purchase order:", error.message);
        throw error;
    }
};