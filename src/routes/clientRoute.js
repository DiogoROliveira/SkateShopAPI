import express from 'express';
import { fetchClients , fetchClientByKey, addNewClient} from '../controllers/jasminController.js';

const router = express.Router();

router.get('/', fetchClients);
router.get('/:key', fetchClientByKey);
router.post('/', addNewClient);
export default router;
