import { generateDate, generateSeriesNumber } from "../helpers/dateHelpers.js";

export const notifyUiPathFilter = (orderData) => {
    const formattedDate = generateDate();

    const documentLines = [];
    for (const product of orderData.products) {
        documentLines.push({
            salesItem: product.itemID,
            description: `Product ${product.itemID}`,
            quantity: product.quantity,
            unitPrice: {
                amount: product.subTotal,
                baseAmount: product.subTotal,
                reportingAmount: product.subTotal,
            },
            unit: "UN"
        });
    }

    return {
        documentType: "ECL",
        serie: "2024",
        seriesNumber: generateSeriesNumber(),
        documentDate: formattedDate,
        postingDate: formattedDate,
        buyerCustomerParty: orderData.customerPartyKey,
        buyerCustomerPartyName: orderData.name,
        buyerCustomerPartyAddress: `${orderData.address} ${orderData.postal_code} ${orderData.city} ${orderData.country}`,
        accountingParty: orderData.customerPartyKey,
        exchangeRate: 1,
        discount: 0,
        currency: "EUR",
        paymentMethod: "NUM",
        paymentTerm: "00",
        company: "DEFAULT",
        deliveryTerm: "TRANSP",
        deliveryOnInvoice: false,
        isSeriesCommunicated: true,
        ignoreAssociatedSalesItems: false,
        documentLines: documentLines,
        WTaxTotal: {
            amount: 0,
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€",
        },
        TotalLiability: {
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€",
        },
        emailTo: orderData.email,
    }
}