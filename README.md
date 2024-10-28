# API Integration for Mendix and Cegid Jasmin
## Configuration
Create a .env file in /src directory that follows the structure:
```bash
JASMIN_BASE_URL=https://my.jasminsoftware.com/api
JASMIN_CLIENT_ID=your-client-id
JASMIN_CLIENT_SECRET=your-client-secret
JASMIN_ACCOUNT=326676
JASMIN_SUBSCRIPTION=326676-0001
```

To acquire the JASMIN_CLIENT_ID and JASMIN_CLIENT_SECRET, you need to:

- Create a Publisher: https://apps.primaverabss.com/publisher/dashboard
- Create an App: https://apps.primaverabss.com/developer/dashboard

When creating the App, you must set the OAuth flow as "Client Credentials" and click the "Reset Client Secret" button.

Install missing dependencies:
```bash
npm isntall
```



## TODO
- App only initiates server on port 3000

- Postman attempt at retrieving invoice data also gives 403
![image](https://github.com/user-attachments/assets/031e928c-c160-40d5-ab11-b6d4724e5a29)

