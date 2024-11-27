import { Router } from 'express';
import { createProduct, getStockById } from './handler/products.handler';
import { createClient } from './handler/clients.handler';

const router = Router();

router.post('/products', createProduct);
router.get('/products/:id/stock', getStockById);

router.post('/clients', createClient);

export default router;
