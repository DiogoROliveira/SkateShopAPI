# API Integration for Mendix and Cegid Jasmin

## **Table of Contents**

1. Description
2. Prerequisites
3. Installation
4. Configuration
5. How to Use
6. API Routes
7. Request Examples
8. Contribution
9. Authors

---

## **Description**

This API provides integration between Mendix and Cegid Jasmin. It is built using the Express.js framework and offers various routes to perform automated operations and efficiently manage integrations.

---

## **Prerequisites**

- **Node.js** v16+
- **NPM** or **Yarn**

---

## **Installation**

```bash
# Clone the repository
git clone https://github.com/DiogoROliveira/SkateShopAPI.git

# Navigate to the project directory
cd SkateShopAPI
```

---

## **Configuration**

Create a `.env` file in the `/src` directory with the following structure:

```env
ACCOUNT=account
SUBSCRIPTION=subscription
CLIENT_ID=client_id
CLIENT_SECRET=client_secret

CLIENT_ID_RPA=rpa_id
REFRESH_TOKEN=token
TENANT_NAME=tenant
UIPATH_URL=url

UIPATH_ORCHESTRATOR_URL=orchestrator_url
UIPATH_RELEASE_KEY=release_key
UIPATH_ORG_UNIT_ID=unit_id

STRIPE_PUBLISHABLE_KEY=publish_key
STRIPE_SECRET_KEY=secret_key
```

### To obtain the CLIENT_ID and CLIENT_SECRET:

- Create a Publisher: [https://apps.primaverabss.com/publisher/dashboard](https://apps.primaverabss.com/publisher/dashboard)
- Create an App: [https://apps.primaverabss.com/developer/dashboard](https://apps.primaverabss.com/developer/dashboard)

When creating the App, set the OAuth flow to "Client Credentials" and click the "Reset Client Secret" button.

### Install missing dependencies:

```bash
npm install
```

Additionally, to allow requests, you will need to create a `token.json` file in the `/src` directory. You can create one using the following template:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5N0U4NTRFQTlFMDREOTI5RTZERTM5REQwM0U0RDZCMjhERDk3NzFSUzI1NiIsIng1dCI6IldYNkZUcW5nVFpLZWJlT2QwRDVOYXlqZGwzRSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5LnByaW1hdmVyYWJzcy5jb20iLCJuYmYiOjE3MzMzMzY2NDUsImlhdCI6MTczMzMzNjY0NSwiZXhwIjoxNzMzMzUxMDQ1LCJhdWQiOlsiamFzbWluIiwiaHR0cHM6Ly9pZGVudGl0eS5wcmltYXZlcmFic3MuY29tL3Jlc291cmNlcyJdLCJzY29wZSI6WyJhcHBsaWNhdGlvbiJdLCJjbGllbnRfaWQiOiJDSEFWRS0xIiwianRpIjoiRTU5MEYxMzU1ODhBRUI4NEEyMzc1MTg3Mjk0RUM1NkYifQ.do4N8Yyfe8qTVXzdiFu6qt53W9okIu1miO4rtgv_UjrapsvW7glexVsfk8dBmv0WoIVAJdzF1laAQFSVwy9MJHMHT6Ug3qU8M43TY2B_opvU6CZTgHpLyHcdfMQozZ5L-QaER7_ElVCs2Qx6dEYdiigbGun9HGQtbSvkdS3Jr5lKsI7FtBHLB9hs53b0Q_8gNKHZVme2-NPit6o0ax-Pobf8aQPQHP3o5p5CsQBytoXpDeon5wM37WjfmVS-EtCZY3h4F0ohkJ6foD_583iZXeVpC_A8lllk9WbKKA6CQLc3OLpmhELc6xt6p3kIsh8GD-mGtmjFSZY_3PhObt2-AA",
  "expires_at": 1733351046174
}
```

---

## **How to Use**

After cloning the repository:

```bash
# Clone the repository
git clone https://github.com/DiogoROliveira/SkateShopAPI.git
```

Start the Express.js server in the `/src` directory with the command:

```bash
cd ./src/
npm start
```

---

## **API Routes**

### Automatic Routes

| Method | Route               | Description                                                                                                      |
| ------ | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| POST   | /erp/clientPurchase | Does a complete client product buying order with bill and receipt generation, includes UiPath Email Notification |

### Client Routes

| Method | Route             | Description          |
| ------ | ----------------- | -------------------- |
| GET    | /erp/clients      | Returns all clients |
| GET    | /erp/clients/:key | Returns one client   |
| POST   | /erp/clients      | Create client        |

### Bill Routes

| Method | Route                     | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | /erp/bills                | Returns all bills  |
| GET    | /erp/bills/:id            | Returns one bill    |
| POST   | /erp/bills                | Create bill         |
| POST   | /erp/bills/generateRecipt | Create receipt      |
| POST   | /erp/bills/suplier        | Create suplier bill |

### Product Routes

| Method | Route              | Description           |
| ------ | ------------------ | --------------------- |
| GET    | /erp/products      | Returns all products |
| GET    | /erp/products/:key | Returns one product  |

### Order Routes

| Method | Route           | Description         |
| ------ | --------------- | :------------------ |
| GET    | /erp/orders     | Returns all orders |
| GET    | /erp/orders/:id | Returns one order  |
| POST   | /erp/orders     | Create order        |

---

## **Request Examples**

### Get All Clients

> **Example Request:**

```bash
/erp/clients
```

> **Example response:**

```json
{
    "id": "2b5b3c39-0de0-425e-842f-d1802d7a7bf0",
    "customerPartyKey": "ALGO"
    "name": "Soluciones Cad de Madrid, SA",
    "email": "N/A",
    "phone": "N/A",
    "address": {
        "street": "Passeo de Portugal",
        "number": "4644",
        "city": "Madrid",
        "postalCode": "28004",
        "country": "Portugal"
    }
}
```

### Get Client by ID

> **Example Request:**

```bash
/erp/clients/0004
```

> **Example response:**

```json
{
    "id": "3a56e209-f2f4-4eb3-8e56-0a8acc202334",
    "customerPartyKey": "0004",
    "name": "Joaquim da Silva Araújo",
    "email": "N/A",
    "phone": "N/A",
    "address": {
        "street": "Rua dos Joaquins",
        "number": "65",
        "city": "Lisboa",
        "postalCode": "1000-321",
        "country": "Portugal"
    }
}
```

### Create Client

> **Example Request:**

```bash
/erp/clients
```

> **Example Body:**

```json
{
  "name": "test",
  "email": "test@test.com",
  "phone_number": "123456789",
  "address": "test",
  "city": "Viana",
  "postal_code": "0000-000",
  "country": "Portugal"
}
```

> **Example response:**

```json
{
    "id": "3a56e209-f2f4-4eb3-8e56-0a8acc202334",
    "customerPartyKey": "0004",
    "name": "Joaquim da Silva Araújo",
    "email": "N/A",
    "phone": "N/A",
    "address": {
        "street": "Rua dos Joaquins",
        "number": "65",
        "city": "Lisboa",
        "postalCode": "1000-321",
        "country": "Portugal"
    }
}
```

---

## **Contribution**

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## **Authors**

* Tiago Passos nº29953
* Diogo Oliveira nº29950
* Mário Fernandes nº25707
