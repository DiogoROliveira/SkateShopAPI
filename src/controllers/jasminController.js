// TODO getCustomer, createOrder, ou listInvoices (funçoes para lidar com as requests)
const { fetchWithCredentials } = require("../services/jasminService");

// Products fetch and transform to ignore slop in response data 🧌
const getSaleItemsList = async (req, res) => {
    try {
        const [saleItemsHttpReq, materialItemsHttpReq] = await Promise.all([
            fetchWithCredentials("/salesCore/salesItems/extension/odata"),
            fetchWithCredentials("/materialsCore/materialsItems/extension/odata"),
        ]);

        const salesItemsData = saleItemsHttpReq.data.items || [];
        const materialItemsData = materialItemsHttpReq.data.items || [];

        res.json(
            salesItemsData.map((salesItem) => {
                const correspondingMaterialItem = materialItemsData.find(
                    (materialItem) => materialItem.itemKey === salesItem.itemKey
                );

                const totalStock = correspondingMaterialItem
                    ? correspondingMaterialItem["materialsItemWarehouses"]
                          .map((warehouse) => warehouse["stockBalance"])
                          .reduce((acc, curr) => acc + curr, 0)
                    : 0;

                const itemPrice = salesItem["priceListLines"][0]
                    ? salesItem["priceListLines"][0]["priceAmount"]["amount"]
                    : 0;

                return {
                    itemKey: salesItem.itemKey,
                    description: salesItem.description,
                    price: itemPrice,
                    quantity: 1,
                    stock: totalStock,
                };
            })
        );
    } catch (error) {
        console.error("Erro ao tratar dados fetched:", error);
        res.status(500).json({ error: "Erro ao tratar dados fetched" });
    }
};

const postStockAdjustment = async (req, res) => {
    const { adjustmentReason, documentLines } = req.body;
    const itemAdjustmentKey = generateItemAdjustmentKey();

    // validates body of the request with joi schema
    const { error } = stockSchema.validate(
        { adjustmentReason, documentLines },
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json({
            errors: error.details.map((err) => err.message),
        });
    }

    const body = {
        itemAdjustmentKey: itemAdjustmentKey.toString(),
        warehouse: "01",
        adjustmentReason,
        company: "DEFAULT",
        documentLines,
    };

    try {
        const response = await fetchWithCredentials(`/materialsManagement/itemAdjustments`, {
            method: "POST",
            form: body,
        });
        console.log("Response:", response.data);
        return res.status(200).json({
            response: response.data,
            message: "Stock changed successfully",
            itemAdjustmentKey,
            errors: false,
        });
    } catch (error) {
        console.error("Error during POST:", error);
        return res.status(500).json({ error: "Error during POST" });
    }
};

const postInvoiceMin = async (req, res) => {
    const { documentLines, emailTo, buyerCustomerPartyName } = req.body;

    const seriesNumber = generateSeriesNumber();
    const deliveryDate = new Date();
    deliveryDate.setMonth(deliveryDate.getMonth() + 1);
    const deliveryDateFormatted = deliveryDate.toISOString().split("T")[0] + "T00:00:00";

    // validates body of the request with joi schema
    const { error } = invoiceSchema.validate(
        { documentLines, emailTo, buyerCustomerPartyName },
        { abortEarly: false }
    );

    if (error) {
        return res.status(400).json({
            errors: error.details.map((err) => err.message),
        });
    }

    const body = {
        documentType: "FA",
        serie: "2024",
        seriesNumber: seriesNumber,
        company: "DEFAULT",
        paymentTerm: "00",
        paymentMethod: "NUM",
        currency: "EUR",
        documentDate: new Date().toISOString().split("T")[0] + "T00:00:00",
        postingDate: new Date().toISOString().split("T")[0] + "T00:00:00",
        buyerCustomerParty: "INDIF",
        buyerCustomerPartyName: buyerCustomerPartyName,
        accountingParty: "INDIF",
        exchangeRate: 1,
        discount: 0,
        loadingCountry: "PT",
        unloadingCountry: "PT",
        isExternal: false,
        isManual: false,
        isSimpleInvoice: false,
        isWsCommunicable: false,
        deliveryItem: "V-VIATURA",
        documentLines: documentLines.map((line) => ({
            ...line,
            unitPrice: {
                ...line.unitPrice,
                fractionDigits: 2,
                symbol: "€",
            },
            unit: "UN",
            itemTaxSchema: "NORMAL",
            deliveryDate: deliveryDateFormatted,
        })),
        WTaxTotal: { amount: 0, baseAmount: 0, reportingAmount: 0, fractionDigits: 2, symbol: "€" },
        TotalLiability: {
            baseAmount: 0,
            reportingAmount: 0,
            fractionDigits: 2,
            symbol: "€",
        },
        emailTo: emailTo,
    };

    try {
        const response = await fetchWithCredentials(`/billing/invoices`, {
            method: "POST",
            form: body,
        });
        console.log("Response:", response.data);
        return res.status(200).json({
            response: response.data,
            message: "Invoice created successfully",
            errors: false,
        });
    } catch (error) {
        console.error("Error during POST:", error);
        return res.status(500).json({ error: "Error during POST" });
    }
};

// helper functions/vars

const Joi = require("joi");

// schema to validate body of stock change request
const stockSchema = Joi.object({
    adjustmentReason: Joi.string().valid("01", "10").required().messages({
        "any.required": "Missing adjustment reason",
        "any.only": "Adjustment reason must be 01 or 10",
    }),
    documentLines: Joi.array()
        .items(
            Joi.object({
                materialsItem: Joi.string().required().messages({
                    "any.required": "Missing materialsItem in document line",
                }),
                quantity: Joi.number().greater(0).required().messages({
                    "any.required": "Missing quantity in document line",
                    "number.greater": "Quantity must be greater than 0 in document lines",
                }),
                unitPrice: Joi.object({
                    amount: Joi.number().greater(0).required().messages({
                        "any.required": "Missing amount in unitPrice in document line",
                        "number.greater": "Amount in unitPrice must be greater than 0",
                    }),
                })
                    .required()
                    .messages({
                        "any.required": "Missing unitPrice object in document line",
                    }),
                unit: Joi.string().equal("UN").required().messages({
                    "any.required": "Missing unit in document line",
                    "string.equal": "Unit must be UN in document lines",
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            "array.min": "No document lines provided",
            "any.required": "Missing document lines",
        }),
});

// schema to validate body of invoice create request
const invoiceSchema = Joi.object({
    documentLines: Joi.array()
        .items(
            Joi.object({
                salesItem: Joi.string().required().messages({
                    "any.required": "Missing salesItem in document line",
                }),
                description: Joi.string().required().messages({
                    "any.required": "Missing description in document line",
                }),
                quantity: Joi.number().greater(0).required().messages({
                    "any.required": "Missing quantity in document line",
                    "number.greater": "Quantity must be greater than 0 in document lines",
                }),
                unitPrice: Joi.object({
                    amount: Joi.number().greater(0).required().messages({
                        "any.required": "Missing amount in unitPrice in document line",
                        "number.greater": "Amount in unitPrice must be greater than 0",
                    }),
                    baseAmount: Joi.number()
                        .greater(0)
                        .required()
                        .equal(Joi.ref("amount"))
                        .messages({
                            "any.required": "Missing baseAmount in unitPrice in document line",
                            "number.greater": "BaseAmount in unitPrice must be greater than 0",
                            "number.equal": "BaseAmount in unitPrice must be equal to amount",
                        }),
                    reportingAmount: Joi.number()
                        .greater(0)
                        .required()
                        .equal(Joi.ref("amount"))
                        .messages({
                            "any.required": "Missing reportingAmount in unitPrice in document line",
                            "number.greater": "ReportingAmount in unitPrice must be greater than 0",
                            "number.equal": "ReportingAmount in unitPrice must be equal to amount",
                        }),
                })
                    .required()
                    .messages({
                        "any.required": "Missing unitPrice object in document line",
                    }),
            })
        )
        .min(1)
        .required()
        .messages({
            "array.min": "No document lines provided",
            "any.required": "Missing document lines",
        }),
    emailTo: Joi.string().email().required().messages({
        "any.required": "Missing emailTo",
        "string.email": "Invalid emailTo",
    }),
    buyerCustomerPartyName: Joi.string().min(1).required().messages({
        "any.required": "Missing buyerCustomerPartyName",
        "string.min": "BuyerCustomerPartyName must have at least 1 character",
    }),
});

function generateItemAdjustmentKey() {
    const timestamp = Date.now(); // milliseconds timestamp
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // number between 1000 & 9999.
    return `${timestamp}${randomSuffix}`;
}

function generateSeriesNumber() {
    const timestamp = Date.now(); // milliseconds timestamp
    const randomSuffix = Math.floor(100 + Math.random() * 900); // number between 100 & 999.
    return `${timestamp}${randomSuffix}`;
}

module.exports = { getSaleItemsList, postStockAdjustment, postInvoiceMin };
