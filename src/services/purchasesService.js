import { getToken } from "../token/token.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/purchases/orders`;

// Formatar os dados de um pedido
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

// Função para obter todas as Purchase Orders
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

// Obter todas as Purchase Orders (GET /purchases/orders/odata)
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
        return data.items.map(formatPurchaseOrderData); // Formatar cada pedido
    } catch (error) {
        console.error("Error fetching purchase orders:", error.message);
        throw error;
    }
};

// Obter uma Purchase Order por ID (GET /purchases/orders/{id})
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
        return formatPurchaseOrderData(orderData); // Formatar os dados do pedido específico
    } catch (error) {
        console.error("Error fetching purchase order by ID:", error.message);
        throw error;
    }
};

// Função para criar uma nova Purchase Order
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

// Função para deletar uma Purchase Order por ID
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

//
// JSON para POST
// {
//   "itemKey": "WHLSWHITE"
// }
