import express from "express";
import {
    fetchClientByKey,
    fetchClients,
    addNewClient,
    fetchBills,
    addNewBill,
    fetchProducts,
    fetchProductsByKey,
    fetchProductsById,
    fetchOrders,
    addNewOrder,
    fetchSalesOrders,
    fetchSalesOrderById,
    createNewSalesOrder,
    deleteOrderById,
    fetchAllPurchaseOrders,
    fetchPurchaseOrderById,
    createNewPurchaseOrder,
    deletePurchaseOrderById,
    getBillByIdControler,
    createReceiptController
} from "../controllers/jasminController.js";

const router = express.Router();

// ========= Clients ============
router.get("/clients", fetchClients);
router.get("/clients/:key", fetchClientByKey);
// Retorna algo do tipo:
/*
{
    "id": "2b5b3c39-0de0-425e-842f-d1802d7a7bf0",
    "customerPartyKey": "ALGO"
    "name": "Soluciones Cad de Madrid, SA",
    "email": "N/A",
    "phone": "N/A",
    "address": {
        "street": "Passeo de Portugal",
        "number": "4644",
        "city": "Madrid",
        "postalCode": "28004",
        "country": "Portugal"
    }
}
*/

router.post("/clients", addNewClient);
//Cria usando:
/*
{
    "id": "2b5b3c39-0de0-425e-842f-d1802d7a7bf0",
    "name": "Soluciones Cad de Madrid, SA",
    "email": "N/A",
    "phone": "N/A",
    "address": {
        "street": "Passeo de Portugal",
        "number": "4644",
        "city": "Madrid",
        "postalCode": "28004",
        "country": "Portugal"
    }
}
*/

// ========= Bills ============
router.get("/bills", fetchBills);
router.get("/bill/:id", getBillByIdControler);
//Depois de fazer o Post ele dá te um id, usa esse id para fazer este get Fatura e obter estes campos
/*
  totalLiabilityAmount
  documentDate
  postingDate
  financialAccount
  buyerCustomerParty
  naturalKey
  totalLiabilityAmount
*/

router.post("/generateRecipt/:naturalKey", createReceiptController)
//Faz agora um post com a informação recebida
/* 
  "totalLiabilityAmount"
  "documentDate"
  "postingDate"
  "financialAccount"
  "buyerCustomerParty"
  "naturalKey"
  "totalLiabilityAmount"
*/

router.post("/bills", addNewBill);

// ======== Stock ============
router.get("/products", fetchProducts);
router.get("/products/key/:itemKey", fetchProductsByKey);
router.get("/products/id/:id", fetchProductsById);

// ======== Orders ============
router.get("/orders", fetchOrders);
router.post("/orders", addNewOrder);
// Exemplo de um pedido:
/*
{
  "buyerCustomerParty": "INDIF",
  "name": "Indiferenciado",
  "address": "Rua de Cima",
  "emailTo": "youremail@gmail.com",
  "documentLines": [
    {
      "salesItem": "DECKLARGE",
      "description": "Tabua Maple 8.0",
      "quantity": 5,
      "unitPrice": { 
        "amount": 1.0,
        "baseAmount": 1.0,
        "reportingAmount": 1.0
        },
      "unit": "UN"
    }
  ]
}


{
  "OrderID": 1,
  "Total": 710.0,
  "name": "dem",
  "email": "dem@example.com",
  "phone_number": "123456789",
  "address": "dem",
  "city": "dem",
  "postal_code": "dem",
  "country": "dem",
  "products": [
    {
      "ItemID": "SKTBLACK",
      "Quantity": 2,
      "SubTotal": 300.0
    }
  ]
}
*/

// Sales Order //
router.get("/salesOrder", fetchSalesOrders); // GET /sales/orders/odata
router.get("/salesOrder/:id", fetchSalesOrderById); // GET /sales/orders/{id}
router.post("/salesOrders", createNewSalesOrder); // POST /sales/orders
router.delete("/salesOrder/:id", deleteOrderById); // DELETE /sales/orders/{id}

// ========= Purchase Orders ============

router.get("/purchaseOrders", fetchAllPurchaseOrders); // Obter todas as Purchase Orders
router.get("/purchaseOrders/:id", fetchPurchaseOrderById); // Obter detalhes de uma Purchase Order por ID
router.post("/purchaseOrders", createNewPurchaseOrder); // Criar uma nova Purchase Order
/*
{
  "sellerSupplierParty": "0020",
  "sellerSupplierPartyName": "FORN TABUAS SKATE",
  "documentLines": [
    {
      "purchasesItem": "DECKLARGE",
      "description": "Tabua Maple 8.0",
      "quantity": 5,
      "unitPrice": { 
        "amount": 40.0,
        "baseAmount": 40.0,
        "reportingAmount": 40.0
        },
      "unit": "UN"
    }
  ],
  "emailTo": "youremail@gmail.com"
}
*/

router.delete("/purchaseOrders/:id", deletePurchaseOrderById); // Apagar uma Purchase Order por ID

export default router;
