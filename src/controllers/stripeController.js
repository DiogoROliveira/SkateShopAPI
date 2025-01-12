import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { cardNumber, expMonth, expYear, cvc, amount } = req.body;

    // Passo 1: Criar um token para validar os dados do cartão
    const { id: tokenId } = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
    });

    // Passo 2: Criar um PaymentIntent usando o token
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // valor em centavos
      currency: 'eur',
      payment_method_data: {
        type: 'card',
        card: {
          token: tokenId,
        },
      },
      confirm: true,
    });

    // Descrição do status da transação
    let paymentStatusDescription = '';

    if (paymentIntent.status === 'succeeded') {
      paymentStatusDescription = 'Pagamento realizado com sucesso!';
    } else if (paymentIntent.status === 'requires_action') {
      paymentStatusDescription = 'Pagamento requer ação adicional';
    } else if (paymentIntent.status === 'requires_payment_method') {
      paymentStatusDescription = 'Pagamento não concluído, método de pagamento necessário.';
    } else {
      paymentStatusDescription = 'Status desconhecido do pagamento.';
    }

    // Retornar o clientSecret e a descrição detalhada do pagamento
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: paymentStatusDescription,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
