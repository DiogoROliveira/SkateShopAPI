import { getAllBills, postBill } from "../services/billService.js";
import { getClientById, createNewClient, getAllClients } from "../services/clientService.js";
import { createNewOrder, getOrders } from "../services/orderService.js";
import { getProductById, getProductByKey, getStock } from "../services/stockService.js";
import { generateSeriesNumber, generateDate } from "../utils/helpers/billHelpers.js";
import { getSalesOrders, getSalesOrderById,createSalesOrder,deleteSalesOrder } from "../services/salesService.js";
import { processCompleteStockAdjustment } from "../services/itemAdjustment.js";
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  deletePurchaseOrder,
} from "../services/purchasesService.js";
import { json } from "express";
import axios from 'axios';
import getAccessToken from '../token/rpaToken.js';
import dotenv from 'dotenv';
dotenv.config();

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

    const formattedDate = generateDate();
    const seriesNumber = generateSeriesNumber();

    const body = {
        documentType: "FA",
        serie: "2024",
        seriesNumber: seriesNumber,
        company: "DEFAULT",
        paymentTerm: "00",
        paymentMethod: "NUM",
        currency: "EUR",
        documentDate: formattedDate,
        postingDate: formattedDate,
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
        // Obter os detalhes do produto com base na chave
        let productDetails = await getProductByKey(itemKey);

        // Verificar se o produto é um skate e ajustar o stock
        let truckKey, deckKey, wheelsKey;

        switch (productDetails.itemKey) {
            case 'SKTBLACK':
                truckKey = 'TRKPRETO';
                deckKey = 'DECKMEDIUM';
                wheelsKey = 'WHLSWHITE';
                break;

            case 'SKTBLUE':
                truckKey = 'TRKCINZA';
                deckKey = 'DECKLARGE';
                wheelsKey = 'WHLSBLACK';
                break;

            case 'SKTWHITE':
                truckKey = 'TRKPRETO';
                deckKey = 'DECKMEDIUM';
                wheelsKey = 'WHLSBLACK';
                break;

            case 'SKTRED':
                truckKey = 'TRKCINZA';
                deckKey = 'DECKLARGE';
                wheelsKey = 'WHLSWHITE';
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
            //processCompleteStockAdjustment(dotenv.SUBSCRIPTION, itemKey, skateStock);

            console.log(`O STOCK do skate ${productDetails.itemKey} foi ajustado para: ${productDetails.stock}`);
        } else {
            console.log('Erro: Não foi possível recuperar os componentes do skate.');
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

    if (!orderDetails) {
        return res.status(400).json({ message: "Order details are required!" });
    }

    try {
        const body = {
            documentType: "ECL",
            serie: "2024",
            seriesNumber: generateSeriesNumber(),
            documentDate: formattedDate,
            postingDate: formattedDate,
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
            isSeriesCommunicated: true,
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

// UI Path NotificationTrigger
const notifyUiPath = async (invoiceId, body) => {
  
    try {
      // Obter o token de acesso
      const accessToken = await getAccessToken();
      const orchestratorUrl = process.env.UIPATH_ORCHESTRATOR_URL;
      const releaseKey = process.env.UIPATH_RELEASE_KEY;
      const orgUnitId = process.env.UIPATH_ORG_UNIT_ID;

      // Mapear os itens comprados
      const itemsList = body.documentLines.map((line) => {
        return `
        - ${line.description} (Quantidade: ${line.quantity}, Preço Unitário: ${line.unitPrice.amount} ${line.unitPrice.symbol}, Total: ${(line.quantity * line.unitPrice.amount).toFixed(2)} ${line.unitPrice.symbol})
        `;
      }).join('');

      const subtotal = parseFloat(body.documentLines.reduce((acc, line) => acc + line.quantity * line.unitPrice.amount, 0));
      const taxes = subtotal * 0.23;
      const total = subtotal + taxes;
  
      const data = {
        startInfo: {
          ReleaseKey: releaseKey,
          Strategy: 'ModernJobsCount',
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
        })
      }
    };
  
      const response = await axios.post(orchestratorUrl, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-UIPATH-OrganizationUnitId': orgUnitId
        },
      });
  
      console.log('Notificação enviada para o UiPath!', response.data);
    } catch (error) {
        if (error.response) {
        console.error('Erro na resposta da API:', error.response.data);
        } else {
        console.error('Erro ao notificar o UiPath:', error.message);
        }
        throw new Error('Erro ao iniciar o processo no UiPath.');
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

// Criar um novo pedido
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
    const newOrder = await createPurchaseOrder(orderData);
    res.status(201).json(newOrder);
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
