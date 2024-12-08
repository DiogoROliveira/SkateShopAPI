import dotenv from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FILE = "token.json";
const URL = "https://identity.primaverabss.com/connect/token";

function importToken() {
    const fileData = fs.readFileSync(FILE, 'utf8');
    try {
        const data = JSON.parse(fileData);
        if (!data.access_token) {
            throw new Error("Token Not Found");
        }else if (!data.expires_at) {
            throw new Error("Data Not Found");
        }
        return data;
    } catch (error) {
        console.error("JSON Read Error:", error);
        return null;
    }
}

export async function getToken() {
    const importedData = importToken();
    const today = Date.now();

    if (importedData && importedData.expires_at > today) {
        return importedData.access_token;
    }

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'application'
        })
    });

    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Error getting token: ${response.status} - ${text}`);
    }

    let data;
    try {
        data = JSON.parse(text); // Parse the response to JSON
    } catch (error) {
        throw new Error(`Error parsing token response: ${text}`);
    }

    console.log("Token Response:", data); // Log for debugging
    return data.access_token;
}


