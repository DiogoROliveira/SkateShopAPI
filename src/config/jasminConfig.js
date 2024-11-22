const jasminBaseURL = process.env.JASMIN_BASE_URL || "https://my.jasminsoftware.com/api";
const jasminUser = process.env.JASMIN_ACCOUNT;
const jasminSub = process.env.JASMIN_SUBSCRIPTION;

module.exports = { jasminBaseURL, jasminUser, jasminSub };
