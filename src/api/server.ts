import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './router/products.router';
import { migrator } from '../migrations/migrator';
import sequelize from '../infra/database';
import { Umzug } from 'umzug';

const PORT = 3000;

const startServer = async () => {
  try {
    let migration: Umzug<any>;
    migration = migrator(sequelize)
    await migration.up()

    const app = express();
    
    // Middlewares
    app.use(bodyParser.json());

    // Rotas
    app.use('/api/v1', productRoutes);    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer()