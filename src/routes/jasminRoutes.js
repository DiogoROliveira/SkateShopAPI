const express = require("express");
const router = express.Router();
const jasminController = require("../controllers/jasminController");

router.get("/saleitems", jasminController.getSaleItemsList);

// To test this endpoint you need to do it in Postman with a POST request, "Content-Type": "application/json" header and raw JSON body
router.post("/stockadjustment", jasminController.postStockAdjustment);
router.post("/postinvoice", jasminController.postInvoiceMin);

module.exports = router;
