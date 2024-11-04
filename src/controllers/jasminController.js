// TODO getCustomer, createOrder, ou listInvoices (funçoes para lidar com as requests)
const { getInvoices, getSaleItems } = require('../services/jasminService');

const getInvoicesList = async (req, res) => {
    try {
        const invoices = await getInvoices(); 
        res.json(invoices); 
    } catch (error) {
        console.error('Erro ao obter faturas:', error);
        res.status(500).json({ error: 'Erro ao obter faturas' }); 
    }
};

const getSaleItemsList = async (req, res) => {
    try{
        const saleItems = await getSaleItems();
        res.json(saleItems);
    } catch (error) {
        console.error('Erro ao obter itens de venda:', error);
        res.status(500).json({ error: 'Erro ao obter itens de venda' });
    }
};


module.exports = { getInvoicesList, getSaleItemsList };
