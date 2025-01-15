import express from 'express';
import erpRoutes from './routes/erpRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

const app = express();

// Middleware para processar JSON
app.use(express.json());

// Definindo as rotas
app.use('/erp', erpRoutes);
app.use('/stripe', stripeRoutes);

const port = 6000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
