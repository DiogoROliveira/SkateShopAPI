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

export const postClientFilter = (clientInfo) => {
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