// TODO getCustomer, createOrder, ou listInvoices (funçoes para lidar com as requests)
const {
    getInvoices,
    getSaleItems,
    getCustomers,
    fetchWithCredentials,
} = require("../services/jasminService");

const getInvoicesList = async (req, res) => {
    try {
        const invoices = await getInvoices();
        res.json(invoices);
    } catch (error) {
        console.error("Erro ao obter faturas:", error);
        res.status(500).json({ error: "Erro ao obter faturas" });
    }
};

/*
const getSaleItemsList = async (req, res) => {
    try{
        const saleItems = await getSaleItems();
        res.json(saleItems);
    } catch (error) {
        console.error('Erro ao obter itens de venda:', error);
        res.status(500).json({ error: 'Erro ao obter itens de venda' });
    }
};
*/

const getCustomerList = async (req, res) => {
    try {
        const customers = await getCustomers();
        res.json(customers);
    } catch (error) {
        console.error("Erro ao obter clientes:", error);
        res.status(500).json({ error: "Erro ao obter clientes" });
    }
};

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

module.exports = { getInvoicesList, getSaleItemsList, getCustomerList };
