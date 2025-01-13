import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { cardNumber, expMonth, expYear, cvc, amount } = req.body;

    // Step 1: Map the card details to a predefined test token
    let token;

    if (cardNumber === '4242424242424242') {
      token = 'tok_visa';
    } else if (cardNumber === '4000000000000341') {
      token = 'tok_chargeDeclinedExpiredCard';
    } else if (cardNumber === '4000000000000259') {
      token = 'tok_cvcCheckFail';
    } else if (cardNumber === '4000000000009995') {
      token = 'tok_chargeDeclined';
    } else {
      return res.status(400).json({ success: false, error: 'Invalid test card number.' });
    }

    // Step 2: Create a PaymentIntent with automatic_payment_methods enabled and redirects disabled
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'eur',
      payment_method_data: {
        type: 'card',
        card: { token },
      },
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    // Step 3: Handle PaymentIntent status
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

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: paymentStatusDescription,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
