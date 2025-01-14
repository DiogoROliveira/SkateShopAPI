import { getClientByKey, postClient, getAllClients } from "../services/clientService.js";
import { getAllBills, postBill, postSuplierBill, createReceiptRequest, getBillById} from "../services/billService.js";
import { createNewOrder, getOrders } from "../services/orderService.js";
import { getProductById, getProductByKey, getStock } from "../services/stockService.js";
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

export const getBillByIdControler = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await getBillById(id); 
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: 'rror retrieving bill!', error: error.message });
    }
};

export const addNewBill = async (reqBody) => {
    const { documentLines, emailTo, buyerCustomerPartyName, buyerCustomerParty } = reqBody;

    const formattedDate = generateDate();
    const seriesNumber = generateSeriesNumber();

    const body = {
        documentType: "FA",
        serie: "2025",
        seriesNumber: seriesNumber,
        company: "DEFAULT",
        paymentMethod: "TRA",
        currency: "EUR",
        documentDate: formattedDate,
        postingDate: formattedDate,
        buyerCustomerParty: buyerCustomerParty,
        buyerCustomerPartyName: buyerCustomerPartyName,
        accountingParty: buyerCustomerParty,
        exchangeRate: 1,
        discount: 0,
        loadingCountry: "PT",
        unloadingCountry: "PT",
        deliveryItem: "SKATEPRODUCT",
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

export const addNewSuplierBill = async (reqBody) => {
    const { documentLines, emailTo, sellerSupplierPartyName, sellerSupplierParty } = reqBody;
    const formattedDate = generateDate();
    const seriesNumber = generateSeriesNumber();

    const body = {
        company: "DEFAULT",
        documentType: "VFA",
        serie: "2025",
        seriesNumber: seriesNumber,
        accountingParty: sellerSupplierParty,
        sellerSupplierParty: sellerSupplierParty,
        sellerSupplierPartyName: sellerSupplierPartyName,
        paymentTerm: "00",
        paymentMethod: "NUM",
        currency: "EUR",
        documentDate: formattedDate,
        exchangeRate: 1,
        postingDate: formattedDate,
        discount: 0,
        loadingCountry: "PT",
        unloadingCountry: "PT",
        deliveryItem: "SKATEPART",
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
        return await postSuplierBill(body);
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
        // Obter os detalhes do produto com base na chave
        let productDetails = await getProductByKey(itemKey);

        // Verificar se o produto é um skate e ajustar o stock
        let truckKey, deckKey, wheelsKey;

        switch (productDetails.itemKey) {
            case "SKTBLACK":
                truckKey = "TRKPRETO";
                deckKey = "DECKMEDIUM";
                wheelsKey = "WHLSWHITE";
                break;

            case "SKTBLUE":
                truckKey = "TRKCINZA";
                deckKey = "DECKLARGE";
                wheelsKey = "WHLSBLACK";
                break;

            case "SKTWHITE":
                truckKey = "TRKPRETO";
                deckKey = "DECKMEDIUM";
                wheelsKey = "WHLSBLACK";
                break;

            case "SKTRED":
                truckKey = "TRKCINZA";
                deckKey = "DECKLARGE";
                wheelsKey = "WHLSWHITE";
                break;

            default:
                return res.status(200).json(productDetails); // Se não for um skate completo, retorne o produto original
        }

        // Buscar as partes do skate
        const truck = await getProductByKey(truckKey);
        const deck = await getProductByKey(deckKey);
        const wheels = await getProductByKey(wheelsKey);

        // Se todas as partes foram encontradas, ajusta o stock do skate
        if (truck && deck && wheels) {
            console.log(`TRUCK STOCK: ${truck.stock}`);
            console.log(`DECK STOCK: ${deck.stock}`);
            console.log(`WHEELS STOCK: ${wheels.stock}`);

            // Calcular o stock do skate com base nas partes
            const skateStock = Math.min(truck.stock, deck.stock, wheels.stock);

            // Atualizar o stock do produto principal (skate) para o MENDIX
            productDetails.stock = skateStock;

            //Atualizar o stock do produto no ERP
            if (skateStock == 0) {
                //Fornecedor Entra Aqui
                console.log("Nível de Stock Baixo!!");
                console.log("A Repor Stock...");

                supplyBodySetter(truckBody, truck);
                supplyBodySetter(deckBody, deck);
                supplyBodySetter(wheelsBody, wheels);

                processPurchaseOrder(truckBody);
                console.log("Nova Encomenda ao Fornecedor: " + truck.itemKey);
                processPurchaseOrder(deckBody);
                console.log("Nova Encomenda ao Fornecedor: " + deck.itemKey);
                processPurchaseOrder(wheelsBody);
                console.log("Nova Encomenda ao Fornecedor: " + wheels.itemKey);
            }

            console.log(
                `O STOCK do skate ${productDetails.itemKey} foi ajustado para: ${productDetails.stock}`
            );
        } else {
            console.log("Erro: Não foi possível recuperar os componentes do skate.");
        }

        // Retornar o produto com o stock ajustado
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

export const createReceiptController = async (req, res) => {
    const requestBody = req.body;

    // Validação do corpo da requisição
    if (!requestBody || Object.keys(requestBody).length === 0) {
        return res.status(400).json({ message: 'Invalid or missing data in the request body!' });
    }

    console.log(requestBody);

    // Criação do objeto de recibo
    const receiptData = {
        company: 'DEFAULT',
        documentType: 'REC',
        documentDate: requestBody.documentDate,
        postingDate: requestBody.postingDate,
        financialAccount: requestBody.financialAccount,
        note: '',
        party: requestBody.buyerCustomerParty,
        currency: 'EUR',
        exchangeRate: 1,
        paymentMethod: 'TRA',
        checkNumber: "",
        openAccountPostingLines: [
            {
                sourceDoc: requestBody.naturalKey,
                settled: requestBody.totalLiabilityAmount,
                discount: '0',
            },
        ],
    };

    try {
        // Chamada para a função que gera os recibos
        const receiptResult = await createReceiptRequest(receiptData);
        res.status(200).json(receiptResult);
    } catch (err) {
        // Tratamento de erros
        console.error("Error generating receipt:", err.message);
        res.status(500).json({ message: 'Failed to generate the invoice receipt!', error: err.message });
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
