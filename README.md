# API Integration for Mendix and Cegid Jasmin
## **Configuration**
Create a .env file in /src directory that follows the structure:
```bash
JASMIN_BASE_URL=https://my.jasminsoftware.com/api
JASMIN_CLIENT_ID=your-client-id
JASMIN_CLIENT_SECRET=your-client-secret
JASMIN_ACCOUNT=327776
JASMIN_SUBSCRIPTION=327776-0001
```

To acquire the JASMIN_CLIENT_ID and JASMIN_CLIENT_SECRET, you need to:

- Create a Publisher: https://apps.primaverabss.com/publisher/dashboard
- Create an App: https://apps.primaverabss.com/developer/dashboard

When creating the App, you must set the OAuth flow as "Client Credentials" and click the "Reset Client Secret" button.

Install missing dependencies:
```bash
npm install
```

## **How to run**
After cloning the repo:
```bash
git clone https://github.com/DiogoROliveira/SkateShopAPI.git
```

Start the express.js server in the /src directory with the command:

```bash
node app.js
```
This will start the server on `http://localhost:3000`

After that you can test the endpoints of the API by following the link to Postman:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/39086830-b39f33bf-1761-4027-ae9c-926b803031d8?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D39086830-b39f33bf-1761-4027-ae9c-926b803031d8%26entityType%3Dcollection%26workspaceId%3Dad19f453-e41f-430a-8210-81a09756ad72)

This collection already has preset body content in each POST request but you can change it if you want to.

## TODO
- Mendix Fetch API
