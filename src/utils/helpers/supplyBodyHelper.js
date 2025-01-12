const firmEmail = "youremail@gmail.com"; // email q o UIPATH vai usar dps

export const truckBody = {
    sellerSupplierParty: "0019",
    sellerSupplierPartyName: "FORN TRUCKS SKATE",
    emailTo: firmEmail,
    documentLines: [
        {
            purchasesItem: "",
            description: "",
            quantity: 5,
            unitPrice: {
                amount: 40.0,
                baseAmount: 40.0,
                reportingAmount: 40.0,
            },
            unit: "UN",
        },
    ],
};

export const deckBody = {
    sellerSupplierParty: "0020",
    sellerSupplierPartyName: "FORN TABUAS SKATE",
    emailTo: firmEmail,
    documentLines: [
        {
            purchasesItem: "",
            description: "",
            quantity: 5,
            unitPrice: {
                amount: 40.0,
                baseAmount: 40.0,
                reportingAmount: 40.0,
            },
            unit: "UN",
        },
    ],
};

export const wheelsBody = {
    sellerSupplierParty: "0018",
    sellerSupplierPartyName: "FORN RODAS SKATE",
    emailTo: firmEmail,
    documentLines: [
        {
            purchasesItem: "",
            description: "",
            quantity: 5,
            unitPrice: {
                amount: 40.0,
                baseAmount: 40.0,
                reportingAmount: 40.0,
            },
            unit: "UN",
        },
    ],
};

export function supplyBodySetter(body, item) {
    body.documentLines[0].purchasesItem = item.itemKey;
    body.documentLines[0].description = item.description;
    body.documentLines[0].unitPrice.amount = item.price;
    body.documentLines[0].unitPrice.baseAmount = item.price;
    body.documentLines[0].unitPrice.reportingAmount = item.price;

    return body;
}
