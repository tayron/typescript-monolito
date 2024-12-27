import express from 'express';
import bodyParser from 'body-parser';
import { migrator } from '../migrations/migrator';
import sequelize from '../infra/database';
import { Umzug } from 'umzug';
import router from './router';

const PORT = 3000;

const startServer = async () => {
  try {
    let migration: Umzug<any>;
    migration = migrator(sequelize, false)
    await migration.up()
    sequelize.sync({ force: true }).then(() => {
      console.log('Database synchronized');
    });

    const app = express();
    
    // Middlewares
    app.use(bodyParser.json());

    // Rotas
    app.use('/api/v1', router);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer()