# API Integration for Mendix and Cegid Jasmin
## Configuration
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
npm isntall
```



## TODO
- A lot, but progress is being made (cope)

- Postman StockChange test working with hardcoded body content:
![image](https://github.com/user-attachments/assets/9aaa4c0e-6073-4b99-82e1-6f3585a02fa8)


