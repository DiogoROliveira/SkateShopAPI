// Configura o Express, regista middlewares e rotas, e inicia o servidor.

const express = require('express');
const jasminRoutes = require('./routes/jasminRoutes');

const app = express();
app.use(express.json());
app.use('/api', jasminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
