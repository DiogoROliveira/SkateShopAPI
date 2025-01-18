import axios from "axios";
import dotenv from "dotenv";
import getAccessToken from "../token/rpaToken.js";
import { notifyUiPathFilter } from "../utils/filters/uipathFilter.js";
import { generateSeriesNumber, generateDate } from "../utils/helpers/dateHelpers.js";
import { getClientByKey, postClient, getAllClients } from "../services/clientService.js";
import { getAllBills, getBillById, postRecipt, postBill, postSuplierBill } from "../services/billService.js";
import { getAllProducts, getProductByKey } from "../services/productService.js";
import { getAllOrders, postOrder, getOrderById} from "../services/orderService.js";
import { getPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, deletePurchaseOrder } from "../services/purchasesService.js";
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

// ======== Products ============
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

        // ======= 1. Notify Admin of Low Stock =======
        if (product.stock <= process.env.ISLOW || product.itemKey == 'SKTRED') {
            notifyUiPathStock(
                process.env.ADMIN_EMAIL,
                product.description,
                product.complementaryDescription,
                product.itemKey,
                product.price,
                product.stock,
            );
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product!", error: error.message });
    }
};

// ======== Orders ============
export const fetchOrders = async (req, res) => {
    try {
        const ordersList = await getAllOrders();
        res.status(200).json(ordersList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products!", error: error.message });
    }
};

export const addNewOrder = async (req, res) => {
    try {
        const orderBody = await postOrder(req.body);
        res.status(201).json(orderBody);
    } catch (error) {
        res.status(500).json({ message: "Error posting order!", error: error.message });
    }
};

export const fetchOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await getOrderById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving order by ID!",
            error: error.message,
        });
    }
};

// ======= Automatics ========
export const clientPurchaseProcess = async (req, res) => {
    const orderData = req.body;

    console.log(orderData);

    try {
        // ======= 1. Create a new order =======
        const orderResponse = await axios.post("http://localhost:6000/erp/orders", orderData);

        // ======= 2. Fetch the order by ID =======
        const orderDetailsResponse = await axios.get(`http://localhost:6000/erp/orders/${orderResponse.data}`);

        // ======= 3. Create a new bill =======
        const billResponse = await axios.post("http://localhost:6000/erp/bills", orderDetailsResponse.data);

        // ======= 4. Fetch the bill by ID =======
        const billDetailsResponse = await axios.get(`http://localhost:6000/erp/bills/${billResponse.data}`);

        // ======= 5. Generate a receipt =======
        const receiptResponse = await axios.post("http://localhost:6000/erp/bills/generateRecipt", billDetailsResponse.data);

        // ======= 6. Notify UiPath =======
        const body = await notifyUiPathFilter(orderData)
        const notifyRPA = await notifyUiPath(billDetailsResponse.data, body);

        return res.status(201).json({
            order: orderResponse.data,
            bill: billResponse.data,
            receipt: receiptResponse.data,
            rpa: notifyRPA,
        });

    } catch (error) {
        console.error("Error processing automatic order:", error);
        return res.status(500).json({
            message: "Error processing automatic order!",
            error: error.message || error,
            stack: error.stack || null,
        });
    }
};



export const clientRegistrationProcess = async (req, res) => {
    const clientData = req.body;

    try {
        // ======= 1. Create a new client =======
        const clientId = await axios.post("http://localhost:6000/erp/clients", clientData);

        // ======= 2. Fetch the client by ID =======
        const clientBody = await axios.get(`http://localhost:6000/erp/clients/${clientId.data}`);

        return res.status(201).json(clientBody.data);

    } catch (error) {
        res.status(500).json({
            message: "Error processing automatic registration!",
            error: error.message,
        });
    }
};

// ======== Purchase Orders ============
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

export const notifyUiPath = async (invoiceId, body) => {
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

    } catch (error) {
        if (error.response) {
            console.error("Erro na resposta da API:", error.response.data);
        } else {
            console.error("Erro ao notificar o UiPath:", error.message);
        }
        throw new Error("Erro ao iniciar o processo no UiPath.");
    }
};

export const notifyUiPathStock = async (emailAdmin, description, complementaryDescription, itemKey, price, stock) => {
    try {
        // Obter o token de acesso
        const accessToken = await getAccessToken();
        const orchestratorUrl = process.env.UIPATH_ORCHESTRATOR_URL;
        const releaseKey = process.env.UIPATH_RELEASE_KEY_STOCK;
        const orgUnitId = process.env.UIPATH_ORG_UNIT_ID;

        const data = {
            startInfo: {
                ReleaseKey: releaseKey,
                Strategy: "ModernJobsCount",
                RobotIds: [],
                NoOfRobots: 1,
                InputArguments: JSON.stringify({
                    EmailAdmin: emailAdmin,
                    Description: description,
                    ComplementaryDescription: complementaryDescription,
                    ItemKey: itemKey,
                    Price: price,
                    Stock: stock
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
