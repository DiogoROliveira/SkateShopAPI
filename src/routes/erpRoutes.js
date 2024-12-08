import express from 'express';
import {
    fetchClients, fetchClientByKey, addNewClient,
    fetchBills,
    fetchProducts, fetchProductsByKey, fetchProductsById,
} from '../controllers/jasminController.js';

const router = express.Router();

router.get('/clients', fetchClients);
router.get('/clients/:key', fetchClientByKey);
router.post('/clients', addNewClient);

router.get('/bills', fetchBills);

router.get('/products', fetchProducts);
router.get('/products/key/:itemKey', fetchProductsByKey);
router.get('/products/id/:id', fetchProductsById);

export default router;
