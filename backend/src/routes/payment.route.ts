/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from "express";
import Stripe from "stripe";

const router = Router();


const getStripeInstance = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  
  return new Stripe(key, {
    apiVersion: "2024-06-20" as any,
  });
};

router.post("/create-intent", async (req: Request, res: Response) => {
  const stripe = getStripeInstance();

  if (!stripe) {
    console.error("❌ STRIPE_SECRET_KEY is missing in .env!");
    return res.status(500).json({ 
      error: "Stripe configuration error. Please check server environment variables." 
    });
  }

  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "Premium Marketplace Order",
    });

    console.log(`✅ Payment Intent Created: ${paymentIntent.id}`);

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error: any) {
    console.error("⚠️ Stripe Error Details:", error.message);
    res.status(500).json({ 
      error: error.message || "Failed to create payment intent" 
    });
  }
});

export default router;