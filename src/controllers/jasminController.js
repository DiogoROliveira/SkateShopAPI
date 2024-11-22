// TODO getCustomer, createOrder, ou listInvoices (funçoes para lidar com as requests)
const {
    getInvoices,
    getSaleItems,
    getCustomers,
    fetchWithCredentials,
    postStockChange,
} = require("../services/jasminService");

// TODO: Refactor this goofy ah request
const getInvoicesList = async (req, res) => {
    try {
        const invoices = await getInvoices();
        res.json(invoices);
    } catch (error) {
        console.error("Erro ao obter faturas:", error);
        res.status(500).json({ error: "Erro ao obter faturas" });
    }
};

// TODO: Refactor this goofy ah request
const getCustomerList = async (req, res) => {
    try {
        const customers = await getCustomers();
        res.json(customers);
    } catch (error) {
        console.error("Erro ao obter clientes:", error);
        res.status(500).json({ error: "Erro ao obter clientes" });
    }
};

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
    const { error } = schema.validate({ adjustmentReason, documentLines }, { abortEarly: false });

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
        const response = await postStockChange(`/materialsManagement/itemAdjustments`, {
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

// helper functions/vars

const Joi = require("joi");

const schema = Joi.object({
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

function generateItemAdjustmentKey() {
    const timestamp = Date.now(); // milliseconds timestamp
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // number between 1000 & 9999.
    return `${timestamp}${randomSuffix}`;
}

module.exports = { getInvoicesList, getSaleItemsList, getCustomerList, postStockAdjustment };
