import express from 'express';
import {
    fetchClients , fetchClientByKey, addNewClient,
    fetchBills, fetchBill
} from '../controllers/jasminController.js';

const router = express.Router();

router.get('/clients', fetchClients);
router.get('/clients/:key', fetchClientByKey);
router.post('/clients', addNewClient);

router.get('/bills', fetchBills);

export default router;
