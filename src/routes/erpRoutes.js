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
} from "../controllers/jasminController.js";

const router = express.Router();

// ========= Clients ============
router.get("/clients", fetchClients);
router.get("/clients/:key", fetchClientByKey);
// Retorna algo do tipo:
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

*/

router.get("/salesOrder", fetchSalesOrders); // GET /sales/orders/odata
router.get("/salesOrder/:id", fetchSalesOrderById); // GET /sales/orders/{id}

export default router;
