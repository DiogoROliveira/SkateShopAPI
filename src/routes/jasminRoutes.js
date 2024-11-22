// TODO adicionar rotas para a API

const express = require("express");
const router = express.Router();
const jasminController = require("../controllers/jasminController");

// router.get('/customer', jasminController.getCustomer);
// router.post('/order', jasminController.createOrder);

router.get("/invoices", jasminController.getInvoicesList);
router.get("/saleitems", jasminController.getSaleItemsList);
router.get("/customers", jasminController.getCustomerList);

// To test this endpoint you need to do it in PostMan with a POST request and "Content-Type": "application/json" header
router.post("/stockadjustment", jasminController.postStockAdjustment);

module.exports = router;
