import { getToken } from '../token/token.js';

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/salesCore/customerParties`;

// Formata os dados do cliente retornados pela API
const formatClientData = (clientData) => {
    return {
        id: clientData.id,
        name: clientData.name,
        email: clientData.electronicMail || 'N/A',
        phone: clientData.telephone || clientData.mobile || 'N/A',
        address: {
            street: clientData.streetName,
            number: clientData.buildingNumber,
            city: clientData.cityName,
            postalCode: clientData.postalZone,
            country: clientData.countryDescription,
        },
    };
};

// Prepara os dados para criar um cliente
const prepareClientData = (clientInfo) => {
    return {
        name: clientInfo.name,
        electronicMail: clientInfo.email,
        telephone: clientInfo.phone,
        streetName: clientInfo.address.street,
        buildingNumber: clientInfo.address.number,
        cityName: clientInfo.address.city,
        postalZone: clientInfo.address.postalCode,
        country: clientInfo.address.country === "Portugal" ? "PT" : clientInfo.address.country,
    };
};

// Função genérica para realizar chamadas à API
const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (!response || !response.ok) {
            const errorMessage = response ? await response.text() : 'No response from server';
            throw new Error(`Response Error: ${response?.status || 'unknown'} - ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Request failed:", error.message);
        throw new Error("Service failure. Please check the URL and service.");
    }
};

// Obter os detalhes de um cliente por sua chave
const getClientDetails = async (clientId) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${clientId}`;

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    return await fetchData(apiURL, options);
};

// Formatar e retornar os detalhes de um cliente por sua chave
export const getClientById = async (clientId) => {
    try {
        const clientData = await getClientDetails(clientId);
        const formattedData = formatClientData(clientData);

        console.log('Client Details:', formattedData);
        return formattedData;
    } catch (error) {
        console.error('Error fetching client details:', error.message);
    }
};

// Criar um novo cliente
export const createNewClient = async (clientInfo) => {
    const token = await getToken();
    const apiURL = `${baseURL}`;

    // Prepara os dados antes de enviar
    const newClientData = prepareClientData(clientInfo);

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClientData),
    };

    return await fetchData(apiURL, options);
};
