import { Router } from 'express';
import { createProduct, getStockById } from '../handler/products.handler';

const router = Router();

router.post('/products', createProduct);
router.get('/products/:id/stock', getStockById);

export default router;
