import { Router } from 'express';
import { createProduct, getProducts, getStockById } from './handler/products.handler';
import { createClient, getClients } from './handler/clients.handler';
import { createPlaceOrder } from './handler/place-order.handler';
import { createInvoice } from './handler/invoice.handler';

const router = Router();

router.post('/products', createProduct);
router.get('/products', getProducts);
router.get('/products/:id/stock', getStockById);

router.post('/clients', createClient);
router.get('/clients', getClients);

router.post('/checkout', createPlaceOrder);
router.post('/invoice', createInvoice);

export default router;
