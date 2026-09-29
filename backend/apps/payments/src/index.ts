import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';

const app = express();
app.use(cors());

// Webhook endpoint needs raw body
app.post('/payments/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // TODO: Verify Stripe signature and update subscription status
  console.log('💰 Webhook received');
  res.json({ received: true });
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Payment Service' });
});

app.post('/payments/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;
  
  // Mock response for now
  res.json({
    url: 'https://checkout.stripe.com/mock-url',
    sessionId: 'sess_mock_12345'
  });
});

app.listen(PORT, () => {
  console.log(`💳 Payment Service running on port ${PORT}`);
});
