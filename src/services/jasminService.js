// TODO logica das chamadas a API do jasmin
const axios = require("axios");
const { getAccessToken } = require("../utils/auth");
const { jasminBaseURL, jasminUser, jasminSub } = require("../config/jasminConfig");

const fetchWithCredentials = async (relativeUrl, opts = {}) => {
    try {
        const token = await getAccessToken();
        const BASE_URL = `${jasminBaseURL}/${jasminUser}/${jasminSub}`;
        console.log("Requesting...", BASE_URL + relativeUrl);

        const form = opts.form ? JSON.stringify(opts.form) : undefined;

        return axios({
            url: BASE_URL + relativeUrl,
            method: opts.method || "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: form,
            ...opts,
        });
    } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = {
    fetchWithCredentials,
};
