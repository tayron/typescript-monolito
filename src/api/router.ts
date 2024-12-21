import { Router } from 'express';
import { createProduct, getProducts, getStockById } from './handler/products.handler';
import { createClient, getClients } from './handler/clients.handler';

const router = Router();

router.post('/products', createProduct);
router.get('/products', getProducts);
router.get('/products/:id/stock', getStockById);

router.post('/clients', createClient);
router.get('/clients', getClients);

export default router;
