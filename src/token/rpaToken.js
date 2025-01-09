import fetch from 'node-fetch'; 
import dotenv from 'dotenv';

dotenv.config();

const getAccessToken = async () => {
  const clientId = process.env.CLIENT_ID_RPA;
  const refreshToken = process.env.REFRESH_TOKEN;
  const tenantName = process.env.TENANT_NAME;
  const url = process.env.UIPATH_URL;

  if (!clientId || !refreshToken || !tenantName || !url) {
    throw new Error('Configuração ausente no arquivo .env');
  }

  const data = {
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-UIPATH-TenantName': tenantName,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro ao obter o Access Token: ${errorData.error || response.statusText}`);
    }

    const responseData = await response.json();
    const accessToken = responseData.access_token;
    console.log('Access Token:', accessToken);
    return accessToken;
  } catch (error) {
    console.error(error.message);
    throw new Error('Falha ao obter o Access Token');
  }
};

export default getAccessToken;
