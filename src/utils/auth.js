// FICHEIRO PARA incluir funções para autenticação, como geração de tokens OAuth2 necessários para chamadas na API da Jasmin.

const axios = require('axios');

let accessToken = null;

async function getAccessToken() {
    if (accessToken) return accessToken; // returns cached token if it exists

    try {
        const response = await axios.post('https://identity.primaverabss.com/connect/token', new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.JASMIN_CLIENT_ID,
            client_secret: process.env.JASMIN_CLIENT_SECRET,
            scope: 'application',
        }));
        
        accessToken = response.data.access_token;
        
        setTimeout(() => { accessToken = null }, (response.data.expires_in - 60) * 1000); // clears token 1 minute before it expires
        return accessToken;
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error);
        throw error;
    }
}

module.exports = { getAccessToken };
