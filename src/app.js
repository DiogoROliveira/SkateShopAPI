import express from 'express';
import  clientRoute from './routes/clientRoute.js';

const app = express();
app.use(express.json());

app.use('/clients', clientRoute);

const port = 6000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
