// Configura o Express, regista middlewares e rotas, e inicia o servidor.


const PORT = process.env.PORT || 3000;
const express = require('express');
const jasminRoutes = require('./routes/jasminRoutes');


const app = express();
app.use(express.json());
// app.use('/api', jasminRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(PORT, (error) =>{
    if(!error){
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        console.log("http://localhost:3000");
    }
    else 
        console.log("Error occurred, server can't start", error);
    });
