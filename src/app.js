import express from 'express';
import erpRoutes from './routes/erpRoutes.js';

const app = express();
app.use(express.json());

app.use('/erp', erpRoutes);

const port = 6000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
