import { getClientByKey, postClient, getAllClients } from "../services/clientService.js";
import { getAllBills, getBillById, postRecipt, postBill, postSuplierBill } from "../services/billService.js";
import { getAllProducts, getProductByKey } from "../services/productService.js";
import { createNewOrder, getOrders } from "../services/orderService.js";
import { generateSeriesNumber, generateDate } from "../utils/helpers/billHelpers.js";
import {
    getSalesOrders,
    getSalesOrderById,
    createSalesOrder,
    deleteSalesOrder,
} from "../services/salesService.js";
import {
    getPurchaseOrders,
    getPurchaseOrderById,
    createPurchaseOrder,
    deletePurchaseOrder,
} from "../services/purchasesService.js";
import axios from "axios";
import getAccessToken from "../token/rpaToken.js";
import dotenv from "dotenv";
import {
    truckBody,
    deckBody,
    wheelsBody,
    supplyBodySetter,
} from "../utils/helpers/supplyBodyHelper.js";
dotenv.config();

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
        const client = await getClientByKey(key);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving client with key!", error: error.message });
    }
};

export const addNewClient = async (req, res) => {
    try {
        const clientBody = await postClient(req.body);
        res.status(201).json(clientBody);
    } catch (error) {
        res.status(500).json({ message: "Error posting client!", error: error.message });
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

export const fetchBillById = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await getBillById(id);
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bill!', error: error.message });
    }
};

export const addNewReceipt = async (req, res) => {
    try {
        const receiptBody = await postRecipt(req.body);
        res.status(201).json(receiptBody);
    } catch (error) {
        res.status(500).json({ message: "Error posting receipt!", error: error.message });
    }
}

export const addNewBill = async (req, res) => {
    try {
        const billBody = await postBill(req.body);
        res.status(201).json(billBody);
    } catch (error) {
        res.status(500).json({ message: "Error posting bill!", error: error.message });
    }
};

export const addNewSuplierBill = async (req, res) => {
    try {
        const billBody = await postSuplierBill(req.body);
        res.status(201).json(billBody);
    } catch (error) {
        res.status(500).json({ message: "Error posting suplier bill!", error: error.message });
    }
};

// ======== Stock ============
export const fetchProducts = async (req, res) => {
    try {
        const productsList = await getAllProducts();
        res.status(200).json(productsList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products!", error: error.message });
    }
};

export const fetchProductsByKey = async (req, res) => {
    const { key } = req.params;
    try {
        const product = await getProductByKey(key);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product!", error: error.message });
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
    const formattedDate = generateDate();

    // Validação para garantir que orderData e products estão presentes
    if (!orderDetails || !Array.isArray(orderDetails.products)) {
        return res.status(400).json({
            message: "Invalid order data! 'products' must be an array."
        });
    }

    console.log(orderDetails);

    // Criando documentLines sem usar map()
    const documentLines = [];
    for (const product of orderDetails.products) {
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

    const filteredOrderData = {
        buyerCustomerParty: orderDetails.customerPartyKey,
        name: orderDetails.name,
        address: `${orderDetails.address} ${orderDetails.postal_code} ${orderDetails.city} ${orderDetails.country}`,
        emailTo: orderDetails.email,
        documentLines
    };

    console.log(filteredOrderData);

    // Ensure documentLines is an array before proceeding
    if (!Array.isArray(filteredOrderData.documentLines)) {
        return res.status(400).json({ message: "documentLines is not an array!" });
    }

    try {
        const body = {
            documentType: "ECL",
            serie: "2025",
            seriesNumber: generateSeriesNumber(),
            documentDate: formattedDate,
            postingDate: formattedDate,
            buyerCustomerParty: filteredOrderData.buyerCustomerParty,
            buyerCustomerPartyName: filteredOrderData.name,
            buyerCustomerPartyAddress: filteredOrderData.address,
            accountingParty: filteredOrderData.buyerCustomerParty,
            exchangeRate: 1,
            discount: 0,
            currency: "EUR",
            paymentMethod: "TRA",
            paymentTerm: "00",
            company: "DEFAULT",
            deliveryTerm: "TRANSP",
            deliveryOnInvoice: false,
            isSeriesCommunicated: true,
            ignoreAssociatedSalesItems: false,
            documentLines: filteredOrderData.documentLines.map((line) => ({
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
            emailTo: filteredOrderData.emailTo,
        };

        console.log(body);
        const createdOrder = await createNewOrder(body);

        const createdBill = await addNewBill({
            ...body
        });

        // Notify UI Path
        await notifyUiPath(createdBill, body);

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



// ======== Sales Orders ============

// Obter todos os pedidos
export const fetchSalesOrders = async (req, res) => {
    try {
        const ordersList = await getSalesOrders();
        res.status(200).json(ordersList);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving orders!",
            error: error.message,
        });
    }
};

// Obter os detalhes de um pedido por ID
export const fetchSalesOrderById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Order ID is required!" });
    }

    try {
        const orderDetails = await getSalesOrderById(id);
        res.status(200).json(orderDetails);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving order by ID!",
            error: error.message,
        });
    }
};

export const createNewSalesOrder = async (req, res) => {
    try {
        const orderData = req.body; // Dados do pedido enviados pelo cliente
        const newOrder = await createSalesOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({
            message: "Error creating new sales order!",
            error: error.message,
        });
    }
};



// Apagar um pedido por ID
export const deleteOrderById = async (req, res) => {
    try {
        const orderId = req.params.id; // ID do pedido recebido como parâmetro
        const result = await deleteSalesOrder(orderId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error deleting sales order!",
            error: error.message,
        });
    }
};

// ======== Purchase Orders ============

// Obter todas as Purchase Orders
export const fetchAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await getPurchaseOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching purchase orders!",
            error: error.message,
        });
    }
};

// Obter detalhes de uma Purchase Order por ID
export const fetchPurchaseOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await getPurchaseOrderById(orderId);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching purchase order by ID!",
            error: error.message,
        });
    }
};

// Criar uma nova Purchase Order
export const createNewPurchaseOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const result = await processPurchaseOrder(orderData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error creating new purchase order!",
            error: error.message,
        });
    }
};

// Apagar uma Purchase Order por ID
export const deletePurchaseOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const result = await deletePurchaseOrder(orderId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error deleting purchase order!",
            error: error.message,
        });
    }
};

const processPurchaseOrder = async (orderData) => {
    const formattedDate = generateDate();

    const body = {
        documentType: "ECF",
        company: "DEFAULT",
        serie: "2024",
        seriesNumber: generateSeriesNumber(),
        documentDate: formattedDate,
        postingDate: formattedDate,
        sellerSupplierParty: orderData.sellerSupplierParty,
        sellerSupplierPartyName: orderData.sellerSupplierPartyName,
        accountingParty: orderData.sellerSupplierParty,
        exchangeRate: 1,
        discount: 0,
        loadingCountry: "PT",
        unloadingCountry: "PT",
        currency: "EUR",
        paymentMethod: "NUM",
        paymentTerm: "00",
        documentLines: orderData.documentLines.map((line) => ({
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
        emailTo: orderData.emailTo,
    };

    const newOrder = await createPurchaseOrder(body);
    const createdBill = await addNewSuplierBill({
        ...orderData,
        documentLines: body.documentLines,
    });

    // Notify UI Path
    await notifyUiPath(createdBill, body);

    return { newOrder, createdBill };
};

// ======== UIPATH =========

const notifyUiPath = async (invoiceId, body) => {
    try {
        // Obter o token de acesso
        const accessToken = await getAccessToken();
        const orchestratorUrl = process.env.UIPATH_ORCHESTRATOR_URL;
        const releaseKey = process.env.UIPATH_RELEASE_KEY;
        const orgUnitId = process.env.UIPATH_ORG_UNIT_ID;

        // Mapear os itens comprados
        const itemsList = body.documentLines
            .map((line) => {
                return `
        - ${line.description} (Quantidade: ${line.quantity}, Preço Unitário: ${
                    line.unitPrice.amount
                } ${line.unitPrice.symbol}, Total: ${(
                    line.quantity * line.unitPrice.amount
                ).toFixed(2)} ${line.unitPrice.symbol})
        `;
            })
            .join("");

        const subtotal = parseFloat(
            body.documentLines.reduce((acc, line) => acc + line.quantity * line.unitPrice.amount, 0)
        );
        const taxes = subtotal * 0.23;
        const total = subtotal + taxes;

        const data = {
            startInfo: {
                ReleaseKey: releaseKey,
                Strategy: "ModernJobsCount",
                RobotIds: [],
                NoOfRobots: 1,
                InputArguments: JSON.stringify({
                    InvoiceId: invoiceId,
                    CustomerEmail: body.emailTo,
                    CustomerName: body.buyerCustomerPartyName,
                    DocumentDate: body.documentDate,
                    PostingDate: body.postingDate,
                    CustomerAddress: body.buyerCustomerPartyAddress,
                    ItemsBought: `${itemsList}`,
                    SubTotal: subtotal.toFixed(2) + " " + body.currency,
                    Taxes: taxes.toFixed(2) + " " + body.currency,
                    TotalAmount: total.toFixed(2) + " " + body.currency,
                }),
            },
        };

        const response = await axios.post(orchestratorUrl, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-UIPATH-OrganizationUnitId": orgUnitId,
            },
        });

        console.log("Notificação enviada para o UiPath!", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Erro na resposta da API:", error.response.data);
        } else {
            console.error("Erro ao notificar o UiPath:", error.message);
        }
        throw new Error("Erro ao iniciar o processo no UiPath.");
    }
};
