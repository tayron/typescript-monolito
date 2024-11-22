import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './router/products.router';

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());

// Rotas
app.use('/api/v1', productRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});