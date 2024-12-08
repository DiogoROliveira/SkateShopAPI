# API Integration for Mendix and Cegid Jasmin
## **Configuration**
Create a .env file in the /src directory that follows the structure:

```env
TENANT=327776
ORGANIZATION=327776-0001
CLIENT_ID=yourid
CLIENT_SECRET=yoursecret
```

To acquire the CLIENT_ID and CLIENT_SECRET, you need to:

- Create a Publisher: https://apps.primaverabss.com/publisher/dashboard
- Create an App: https://apps.primaverabss.com/developer/dashboard

When creating the App, you must set the OAuth flow as "Client Credentials" and click the "Reset Client Secret" button.

Install missing dependencies:
```bat
npm install
```

Also, to allow requests you will need to create a token.json in the /src directory, you can create one using this template

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5N0U4NTRFQTlFMDREOTI5RTZERTM5REQwM0U0RDZCMjhERDk3NzFSUzI1NiIsIng1dCI6IldYNkZUcW5nVFpLZWJlT2QwRDVOYXlqZGwzRSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5LnByaW1hdmVyYWJzcy5jb20iLCJuYmYiOjE3MzMzMzY2NDUsImlhdCI6MTczMzMzNjY0NSwiZXhwIjoxNzMzMzUxMDQ1LCJhdWQiOlsiamFzbWluIiwiaHR0cHM6Ly9pZGVudGl0eS5wcmltYXZlcmFic3MuY29tL3Jlc291cmNlcyJdLCJzY29wZSI6WyJhcHBsaWNhdGlvbiJdLCJjbGllbnRfaWQiOiJDSEFWRS0xIiwianRpIjoiRTU5MEYxMzU1ODhBRUI4NEEyMzc1MTg3Mjk0RUM1NkYifQ.do4N8Yyfe8qTVXzdiFu6qt53W9okIu1miO4rtgv_UjrapsvW7glexVsfk8dBmv0WoIVAJdzF1laAQFSVwy9MJHMHT6Ug3qU8M43TY2B_opvU6CZTgHpLyHcdfMQozZ5L-QaER7_ElVCs2Qx6dEYdiigbGun9HGQtbSvkdS3Jr5lKsI7FtBHLB9hs53b0Q_8gNKHZVme2-NPit6o0ax-Pobf8aQPQHP3o5p5CsQBytoXpDeon5wM37WjfmVS-EtCZY3h4F0ohkJ6foD_583iZXeVpC_A8lllk9WbKKA6CQLc3OLpmhELc6xt6p3kIsh8GD-mGtmjFSZY_3PhObt2-AA",
  "expires_at": 1733351046174
}


## **How to run**
After cloning the repo:

```gitattributes
git clone https://github.com/DiogoROliveira/SkateShopAPI.git
```

Start the express.js server in the /src directory with the command:

```node
npm start
```

This will start the server on `http://localhost:6000`

## TODO
- Filter ERP information for Mendix
- Mendix Fetch API
