// Formata os dados do cliente retornados pela API
const formatClientData = (clientData) => {
    return {
        id: clientData.id,
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

// Formatar os dados de um pedido
const formatPurchaseOrderData = (orderData) => {
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


// Formatar os dados de um pedido
const formatPurchaseForPost = (orderData) => {
    let supplier;
    if (orderData.itemKey == "WHLSWHITE" || orderData.itemKey == "WHLSBALCK") {
      supplier = '0018';
    }else{
      if (orderData.itemKey == "DECKLARGE" || orderData.itemKey == "DECKMEDIUM") {
        supplier = '0020';
      }else{
        if (orderData.itemKey == "TRKCINZA" || orderData.itemKey == "TRKPRETO") {
          supplier = '0019';
        }
      }
    }
    return {
      orderDate: new Date().toISOString().split('T')[0],  // Today's date
      currency: 'EUR',
      totalAmount: orderData.totalAmount?.amount || 0,
      currency: orderData.totalAmount?.currency || "EUR",
      documentStatus: orderData.documentStatus?.description || "2",
      company: 'DEFAULT',
      sellerSupplierParty: supplier, //RODAS 0018 / TRUCKS 0019 / DECKS 0020
      documentLines: [
        {
          version: [
            0,
            0,
            0,
            0,
            0,
            0,
            58,
            21
          ],
          purchasesItem: orderData.itemKey, //itemKey
          purchasesItemDescription: orderData.itemKey //itemKey
        }
      ]
    };
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