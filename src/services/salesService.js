import { getToken } from "../token/token.js";
const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/sales/orders`;

// Formatar os dados de um pedido
export const formatOrderData = (orderData) => {
    return {
        id: orderData.id,
        documentNumber: orderData.documentNumber,
        buyerCustomerParty: orderData.buyerCustomerParty,
        orderDate: orderData.documentDate,
        totalAmount: orderData.totalAmount?.amount || 0,
        currency: orderData.totalAmount?.currency || "N/A",
        documentStatus: orderData.documentStatus?.description || "N/A",
    };
};

// Função genérica para realizar chamadas à API
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

// Obter todos os pedidos (GET /sales/orders/odata)
export const getSalesOrders = async () => {
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

// Obter os detalhes de um pedido por ID (GET /sales/orders/{id})
export const getSalesOrderById = async (orderId) => {
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
        return formatOrderData(orderData);
    } catch (error) {
        console.error("Error fetching order by ID:", error.message);
        throw error;
    }
};

// Função para criar um novo pedido
export const createSalesOrder = async (orderData) => {
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
            throw new Error(`Failed to create order: ${response.status} - ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating order:", error.message);
        throw error;
    }
};

// Função para deletar um pedido por ID
export const deleteSalesOrder = async (orderId) => {
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
            throw new Error(`Failed to delete order: ${response.status} - ${errorMessage}`);
        }

        return { message: "Order deleted successfully" };
    } catch (error) {
        console.error("Error deleting order:", error.message);
        throw error;
    }
};

//Estrutura JSON para o POST
// {
//     "buyerCustomerParty": "Customer123",
//     "documentType": "ECL",
//     "documentDate": "2025-01-01T00:00:00",
//     "company": "YourCompany",
//     "lineItems": [
//         {
//             "salesItem": "Item123",
//             "quantity": 2,
//             "unitPrice": 50
//         }
//     ]
// }
