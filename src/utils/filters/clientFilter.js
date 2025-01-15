export const getClientListFilter = (clientsList) => {
    return clientsList.map((clientData) => ({
        id: clientData.id,
        customerPartyKey : clientData.partyKey,
        name: clientData.name,
        email: clientData.electronicMail || "N/A",
        phone: clientData.telephone || clientData.mobile || "N/A",
        address: {
            street: clientData.streetName,
            number: clientData.buildingNumber,
            city: clientData.cityName,
            postalCode: clientData.postalZone,
            country: clientData.countryDescription,
        },
    }));
};

export const getClientFilter = (clientData) => {
    return {
        id: clientData.id,
        customerPartyKey : clientData.partyKey,
        name: clientData.name,
        email: clientData.electronicMail || "N/A",
        phone: clientData.telephone || clientData.mobile || "N/A",
        address: {
            street: clientData.streetName,
            number: clientData.buildingNumber,
            city: clientData.cityName,
            postalCode: clientData.postalZone,
            country: clientData.countryDescription,
        },
    };
};

export const validateClientInfo = (clientInfo) => {
    // Lista de parâmetros obrigatórios
    const requiredFields = [
        { key: "name", type: "string" },
        { key: "email", type: "string" },
        { key: "phone_number", type: "string" },
        { key: "address", type: "string" },
        { key: "city", type: "string" },
        { key: "postal_code", type: "string" },
        { key: "country", type: "string" },
    ];

    // Validação dos campos obrigatórios
    for (const field of requiredFields) {
        if (!clientInfo[field.key] || typeof clientInfo[field.key] !== field.type) {
            throw new Error(`Invalid or missing field: ${field.key}. Expected a ${field.type}.`);
        }
    }

    // Validação adicional de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) {
        throw new Error("Invalid email format.");
    }

    // Validação de telefone
    if (!/^\d{9}$/.test(clientInfo.phone_number)) {
        throw new Error("Invalid phone number format. It should contain exactly 9 digits.");
    }

    return clientInfo;
};


export const postClientFilter = (clientInfo) => {
    return clientInfo = {
        name: clientInfo.name,
        currency: "EUR",
        isPerson: true,
        companyTaxID: "123456789",
        customerGroup: "02",
        paymentMethod: "TRA",
        paymentTerm: "01",
        partyTaxSchema: "CONTINENTE",
        locked: false,
        accountingSchema: 1,
        oneTimeCustomer: false,
        endCustomer: true,
        electronicMail: clientInfo.email,
        telephone: clientInfo.phone_number,
        streetName: clientInfo.address,
        buildingNumber: "1",
        cityName: clientInfo.city,
        postalZone: clientInfo.postal_code,
        country: clientInfo.country === "Portugal" ? "PT" : clientInfo.country,
    };
};
