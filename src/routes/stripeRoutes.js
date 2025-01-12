import express from "express";
import { createPayment } from "../controllers/stripeController.js";

const router = express.Router();

// Rota para criar um pagamento
router.post('/create-payment', createPayment);

/*
**Como usar o endpoint para simulação de pagamento**

1. Faça uma requisição `POST` para o endpoint `/create-payment` com os dados do cartão de crédito no corpo da requisição.
2. O corpo da requisição deve conter os seguintes campos:
   - `cardNumber`: Número do cartão (veja abaixo os cartões de teste)
   - `expMonth`: Mês de expiração do cartão
   - `expYear`: Ano de expiração do cartão
   - `cvc`: Código de segurança (CVV) do cartão
   - `amount`: Valor do pagamento (em euros)

**Cartões de Teste para Simular Diferentes Cenários de Pagamento com Stripe:**

Use os seguintes números de cartão para simular diferentes resultados de pagamento com a Stripe:

| **Número de Cartão**        | **Descrição**                           | **CVC** | **Data de Expiração** |
|-----------------------------|-----------------------------------------|---------|-----------------------|
| 4242 4242 4242 4242         | Pagamento bem-sucedido                  | 123     | Qualquer futura       |
| 4000 0000 0000 0341         | Cartão expirado                         | 123     | Qualquer passada      |
| 4000 0000 0000 0259         | CVC inválido                            | 123     | Qualquer futura       |
| 4000 0000 0000 9995         | Pagamento recusado pela Stripe          | 123     | Qualquer futura       |

Esses números de cartão são fornecidos pela Stripe para testar diferentes cenários de pagamento e simular o
comportamento do sistema. A resposta do endpoint irá variar dependendo do cartão utilizado e do seu status.

**Resposta Esperada:**

- Se os dados do cartão forem válidos e o pagamento for processado com sucesso, a resposta incluirá um `clientSecret`,
que pode ser usado para concluir o pagamento no frontend.

Exemplo de resposta:

  {
    "success": true,
    "clientSecret": "pi_1N1234abcd_secret_ABC123XYZ",
    "message": "Pagamento realizado com sucesso!"
  }
Se o pagamento exigir uma ação adicional, como uma autenticação 3D Secure, a resposta indicará que a ação é necessária.

Exemplo de resposta:

{
  "success": true,
  "clientSecret": "pi_1N1234abcd_secret_ABC123XYZ",
  "message": "Pagamento requer ação adicional (ex: autenticação do 3DS)."
}
Se o pagamento falhar, como quando o cartão é expirado ou o CVC é inválido, a resposta incluirá uma mensagem de erro.

Exemplo de resposta de erro:

{
  "success": false,
  "error": "Seu número de cartão está incorreto."
}
O clientSecret fornecido deve ser usado no frontend para concluir o pagamento.

*/

export default router;