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
    const body = {
        itemAdjustmentKey: "110100010000", // TODO: generate unique key for every request
        warehouse: "01",
        adjustmentReason: "01", // TODO: ability to switch reason from 10 (add to stock) to 01 (remove from stock)
        company: "DEFAULT", // Company allways DEFAULT
        documentLines: [
            {
                materialsItem: "DECK", // TODO: Make this dynamic
                quantity: 3, // This as well
                unitPrice: { amount: 40.0 }, // Also this 💀💀
                unit: "UN",
            },
        ],
    };

    try {
        const response = await postStockChange(`/materialsManagement/itemAdjustments`, {
            form: body,
        });
        console.log("Response:", response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error during POST:", error);
        return res.status(500).json({ error: "Error during POST" });
    }
};

module.exports = { getInvoicesList, getSaleItemsList, getCustomerList, postStockAdjustment };
