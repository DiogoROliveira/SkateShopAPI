import { getToken } from "../token/token.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/sales/orders`;

// Função genérica para realizar chamadas à API
const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (!response || !response.ok) {
      const errorMessage = response
        ? await response.text()
        : "No response from server";
      throw new Error(
        `Response Error: ${response?.status || "unknown"} - ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error.message);
    throw new Error("Service failure. Please check the URL and service.");
  }
};

// Formatar os dados de um pedido
const formatOrderData = (orderData) => {
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

//   try {
//     const data = await fetchData(apiURL, options);
//     return data.items.map(formatOrderData);
//   } catch (error) {
//     console.error("Error fetching orders:", error.message);
//     throw error;
//   }
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
