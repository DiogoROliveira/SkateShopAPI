// TODO adicionar rotas para a API

const express = require('express');
const router = express.Router();
const jasminController = require('../controllers/jasminController');


// router.get('/customer', jasminController.getCustomer);
// router.post('/order', jasminController.createOrder);

router.get('/invoices', jasminController.getInvoicesList);




module.exports = router;
