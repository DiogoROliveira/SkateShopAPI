import { getAllBills, postBill } from "../services/billService.js";
import { getAllClients, getClientByKey, createNewClient } from "../services/clientService.js";
import { createNewOrder, getOrders } from "../services/orderService.js";
import { getProductById, getProductByKey, getStock } from "../services/stockService.js";
import { validateOrderRequest } from "../utils/validators/orderValidator.js";
import { generateSeriesNumber } from "../utils/helpers/billHelpers.js";

// ========= Clients ============
export const fetchClients = async (req, res) => {
    try {
        const clientsList = await getAllClients();
        res.status(200).json(clientsList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving clients!", error: error.message });
    }
};

export const fetchClientByKey = async (req, res) => {
    const { key } = req.params;

    try {
        const clientDetails = await getClientById(key);
        res.status(200).json(clientDetails);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving client!", error: error.message });
    }
};

export const addNewClient = async (req, res) => {
    const clientDetails = req.body;

    try {
        const createdClient = await createNewClient(clientDetails);
        res.status(201).json(createdClient);
    } catch (error) {
        res.status(500).json({ message: "Error creating client!", error: error.message });
    }
};

// ========= Bills ============
export const fetchBills = async (req, res) => {
    try {
        const billsList = await getAllBills();
        res.status(200).json(billsList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving bills!", error: error.message });
    }
};

export const addNewBill = async (req, res) => {
    const { documentLines, emailTo, buyerCustomerPartyName } = req.body;

    const seriesNumber = generateSeriesNumber();
    const deliveryDate = new Date();
    deliveryDate.setMonth(deliveryDate.getMonth() + 1);
    const deliveryDateFormatted = deliveryDate.toISOString().split("T")[0] + "T00:00:00";

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
        const createdBill = await postBill(body);
        res.status(201).json(createdBill);
    } catch (error) {
        res.status(500).json({ message: "Error creating bill!", error: error.message });
    }
};

// ======== Stock ============
export const fetchProducts = async (req, res) => {
    try {
        const productList = await getStock();
        res.status(200).json(productList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products!", error: error.message });
    }
};

export const fetchProductsByKey = async (req, res) => {
    const { key } = req.params;

    try {
        const productDetails = await getProductByKey(key);
        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving product using key!",
            error: error.message,
        });
    }
};

export const fetchProductsById = async (req, res) => {
    const { id } = req.params;

    try {
        const productDetails = await getProductById(id);
        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving product using id!",
            error: error.message,
        });
    }
};

// ======== Orders ============

export const fetchOrders = async (req, res) => {
    try {
        const ordersList = await getOrders();
        res.status(200).json(ordersList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders!", error: error.message });
    }
};

export const addNewOrder = async (req, res) => {
    const orderDetails = req.body;

    if (!orderDetails) {
        return res.status(400).json({ message: "Order details are required!" });
    }

    try {
        validateOrderRequest(orderDetails);

        const customerParty = await findOrCreateCustomerParty(orderDetails.buyerCustomerParty);

        const createdOrder = await createNewOrder({
            ...orderDetails,
            customerPartyId: customerParty.id,
        });

        const createdBill = await addNewBill(createdOrder);

        res.status(201).json({
            order: createdOrder,
            bill: createdBill,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error processing order!",
            error: error.message,
        });
    }
};

async function findOrCreateCustomerParty(customerPartyCode) {
    let customerParty = await getClientByKey(customerPartyCode);

    if (!customerParty) {
        customerParty = await addNewClient({
            partyKey: customerPartyCode,
        });
    }

    return customerParty;
}
