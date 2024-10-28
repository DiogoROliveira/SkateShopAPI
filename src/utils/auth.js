// FICHEIRO PARA incluir funções para autenticação, como geração de tokens OAuth2 necessários para chamadas na API da Jasmin.

const axios = require('axios');

let accessToken = null;

async function getAccessToken() {
    if (accessToken) return accessToken; // returns cached token if it exists

    console.log('Obtendo token de acesso...');
    console.log(process.env.JASMIN_CLIENT_ID);
    console.log(process.env.JASMIN_CLIENT_SECRET);


    try {
        const response = await axios.post('https://identity.primaverabss.com/core/connect/token', new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.JASMIN_CLIENT_ID,
            client_secret: process.env.JASMIN_CLIENT_SECRET,
            scope: 'application',
        }));
        
        accessToken = response.data.access_token;

        console.log('Token de acesso obtido:', accessToken);

        
        setTimeout(() => { accessToken = null }, (response.data.expires_in - 60) * 1000); // clears token 1 minute before it expires
        return accessToken;
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error);
        throw error;
    }
}

module.exports = { getAccessToken };
