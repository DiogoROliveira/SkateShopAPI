import express from "express";
import {
  //Clients
    fetchClientByKey,
    fetchClients,
    addNewClient,

  //Bills
    fetchBills,
    fetchBillById,
    addNewReceipt,
    addNewBill,
    addNewSuplierBill,

  //Products
    fetchProducts,
    fetchProductsByKey,

  //Orders
    fetchOrders,
    addNewOrder,
    fetchOrderById,

  //Automatics
    clientPurchaseProcess,
    clientRegistrationProcess,

    fetchAllPurchaseOrders,
    fetchPurchaseOrderById,
    createNewPurchaseOrder,
    deletePurchaseOrderById
} from "../controllers/jasminController.js";

const router = express.Router();

// ========= Clients ============
router.get("/clients", fetchClients);
router.get("/clients/:key", fetchClientByKey);
router.post("/clients", addNewClient);

// ========= Bills ============
router.get("/bills", fetchBills);
router.get("/bills/:id", fetchBillById);
router.post("/bills/generateRecipt", addNewReceipt)
router.post("/bills", addNewBill);
router.post("/bills/suplier", addNewSuplierBill);

// ======== Stock ============
router.get("/products", fetchProducts);
router.get("/products/:key", fetchProductsByKey);

// ======== Orders ============
router.get("/orders", fetchOrders);
router.post("/orders", addNewOrder);
router.get("/orders/:id", fetchOrderById);

// ======= Automatics ========
router.post("/clientPurchase", clientPurchaseProcess);
router.post("/clientRegistration", clientRegistrationProcess)

// ========= Purchase Orders ============

router.get("/purchaseOrders", fetchAllPurchaseOrders);
router.get("/purchaseOrders/:id", fetchPurchaseOrderById);
router.post("/purchaseOrders", createNewPurchaseOrder);
router.delete("/purchaseOrders/:id", deletePurchaseOrderById); // Apagar uma Purchase Order por ID

export default router;


// +++++++ Deduzir Stock Skate pelas Partes ++++++++++
/*
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
*/