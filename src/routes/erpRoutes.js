import express from 'express';
import {
    fetchClients, fetchClientByKey, addNewClient,
    fetchBills,
    fetchProducts, fetchProductsByKey, fetchProductsById,
    fetchOrders, addNewOrder,
} from '../controllers/jasminController.js';

const router = express.Router();

// ========= Clients ============
router.get('/clients', fetchClients);
router.get('/clients/:key', fetchClientByKey);
router.post('/clients', addNewClient);

// ========= Bills ============
router.get('/bills', fetchBills);

// ======== Stock ============
router.get('/products', fetchProducts);
router.get('/products/key/:itemKey', fetchProductsByKey);
router.get('/products/id/:id', fetchProductsById);

// ======== Orders ============
router.get('/orders', fetchOrders);
router.post('/orders', addNewOrder);

export default router;
