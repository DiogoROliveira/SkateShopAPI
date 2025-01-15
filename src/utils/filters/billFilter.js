import { generateSeriesNumber, generateDate } from "../helpers/dateHelpers.js";
export const getBillListFilter = (billsList) => {
    return billsList.map((billData) => ({
        id: billData.id,
        buyerCustomerParty: billData.buyerCustomerParty,
        naturalKey: billData.naturalKey,
        totalLiabilityAmount: billData.totalLiabilityAmount,
        documentDate: billData.documentDate,
        postingDate: billData.postingDate,
        financialAccount: billData.financialAccount,
        currency: billData.currency,
        paymentMethod: billData.paymentMethod
    }));
};

export const getBillFilter = (billData) => {
    return {
        id: billData.id,
        buyerCustomerParty: billData.buyerCustomerParty,
        naturalKey: billData.naturalKey,
        totalLiabilityAmount: billData.totalLiability.amount,
        documentDate: billData.documentDate,
        postingDate: billData.postingDate,
        financialAccount: billData.financialAccount,
        currency: billData.currency,
        paymentMethod: billData.paymentMethod
    };
};

export const postReciptFilter = (reciptData) => {
    return {
        company: 'DEFAULT',
        documentType: 'REC',
        documentDate: reciptData.documentDate,
        postingDate: reciptData.postingDate,
        financialAccount: reciptData.financialAccount,
        note: '',
        party: reciptData.buyerCustomerParty,
        currency: reciptData.currency,
        exchangeRate: 1,
        paymentMethod: reciptData.paymentMethod,
        checkNumber: '',
        openAccountPostingLines: [
            {
                sourceDoc: reciptData.naturalKey,
                settled: reciptData.totalLiabilityAmount,
                discount: '0',
            },
        ],
    };
}

export const postBillFilter = (billData) => {
    const formattedDate = generateDate();
    const seriesNumber = generateSeriesNumber();
    return {
        documentType: "FA",
        serie: "2025",
        seriesNumber: seriesNumber,
        company: "DEFAULT",
        paymentMethod: "TRA",
        currency: "EUR",
        documentDate: formattedDate,
        postingDate: formattedDate,
        buyerCustomerParty: billData.buyerCustomerParty,
        buyerCustomerPartyName: billData.buyerCustomerPartyName,
        accountingParty: billData.buyerCustomerParty,
        exchangeRate: 1,
        discount: 0,
        loadingCountry: "PT",
        unloadingCountry: "PT",
        deliveryItem: "SKATEPRODUCT",
        documentLines: billData.documentLines,
        WTaxTotal: {
            amount: 0,
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€"
        },
        TotalLiability: {
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€",
        },
        emailTo: billData.emailTo,
    };
}


export const postSuplierBillFilter = (billData) => {
    const formattedDate = generateDate();
    const seriesNumber = generateSeriesNumber();
    return {
        company: "DEFAULT",
        documentType: "VFA",
        serie: "2025",
        seriesNumber: seriesNumber,
        accountingParty: billData.sellerSupplierParty,
        sellerSupplierParty: billData.sellerSupplierParty,
        sellerSupplierPartyName: billData.sellerSupplierPartyName,
        paymentTerm: "00",
        paymentMethod: "NUM",
        currency: "EUR",
        documentDate: formattedDate,
        exchangeRate: 1,
        postingDate: formattedDate,
        discount: 0,
        loadingCountry: "PT",
        unloadingCountry: "PT",
        deliveryItem: "SKATEPART",
        documentLines: billData.documentLines,
        WTaxTotal: {
            amount: 0,
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€"
        },
        TotalLiability: {
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€",
        },
        emailTo: billData.emailTo,
    };
}