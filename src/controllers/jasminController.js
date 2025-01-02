import { getAllBills, postBill } from "../services/billService.js";
import { getClientById, createNewClient, getAllClients } from "../services/clientService.js";
import { createNewOrder, getOrders } from "../services/orderService.js";
import { getProductById, getProductByKey, getStock } from "../services/stockService.js";
import { generateSeriesNumber } from "../utils/helpers/billHelpers.js";
import { json } from "express";

// ========= Clients ============
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

export const fetchClients = async (req, res) => {
    try {
        const response = await getAllClients();
        const clientsList = response.items;

        const filteredClientsList = clientsList.map((client) => ({
            Id: client.id,
            name: client.name,
            electronicMail: client.electronicMail,
            customerPartyKey: client.partyKey,
        }));

        res.status(200).json(filteredClientsList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving clients!", error: error.message });
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

export const addNewBill = async (reqBody) => {
    const { documentLines, emailTo, buyerCustomerPartyName, buyerCustomerParty } = reqBody;

    const seriesNumber = generateSeriesNumber();
    const deliveryDate = new Date();
    deliveryDate.setMonth(deliveryDate.getMonth() + 1);

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
        buyerCustomerParty: buyerCustomerParty,
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
        documentLines: documentLines,
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
        return await postBill(body);
    } catch (error) {
        throw new Error(`Error creating bill: ${error.message}`);
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
    const { itemKey } = req.params;
    if (!itemKey) {
        return res.status(400).json({ message: "Product key is required!" });
    }

    console.log("FETCH itemKey : " + itemKey);
    try {
        const productDetails = await getProductByKey(itemKey);
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
        const body = {
            documentType: "ECL",
            serie: "2024",
            seriesNumber: generateSeriesNumber(),
            documentDate: new Date().toISOString().split("T")[0] + "T00:00:00",
            postingDate: new Date().toISOString().split("T")[0] + "T00:00:00",
            buyerCustomerParty: orderDetails.buyerCustomerParty,
            buyerCustomerPartyName: orderDetails.name,
            buyerCustomerPartyAddress: orderDetails.address,
            accountingParty: "INDIF",
            exchangeRate: 1,
            discount: 0,
            currency: "EUR",
            paymentMethod: "NUM",
            paymentTerm: "00",
            company: "DEFAULT",
            deliveryTerm: "TRANSP",
            deliveryOnInvoice: false,
            isSeriesCommunicated: false,
            ignoreAssociatedSalesItems: false,
            documentLines: orderDetails.documentLines.map((line) => ({
                ...line,
                unitPrice: {
                    ...line.unitPrice,
                    fractionDigits: 2,
                    symbol: "€",
                },
                unit: "UN",
                itemTaxSchema: "NORMAL",
            })),
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
            emailTo: orderDetails.emailTo,
        };

        const createdOrder = await createNewOrder(body);

        const createdBill = await addNewBill({
            ...orderDetails,
            documentLines: body.documentLines,
        });

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
    let customerParty = await getClientById(customerPartyCode);

    if (!customerParty) {
        customerParty = await addNewClient({
            partyKey: customerPartyCode,
        });
    }

    return customerParty;
}
