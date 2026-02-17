/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, OrderFormData } from "@/lib/order-schema";
import { AddressForm } from '@/components/checkouts/Addressform';
import { useCart } from '@/app/context/cartcontext';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Truck, CreditCard, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function ShoppingCheckoutContent({ clientSecret }: { clientSecret: string }) {
  const { shoppingCart, getShoppingTotal, clearShoppingCart } = useCart();
  const subtotal = getShoppingTotal();
  const stripe = useStripe();
  const elements = useElements();

  const shippingCharge = subtotal > 0 ? 30 : 0;
  const deliveryCharge = (subtotal > 0 && subtotal < 500) ? 40 : (subtotal >= 500 && subtotal <= 1000) ? 35 : 0;
  const finalGrandTotal = subtotal + shippingCharge + deliveryCharge;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const methods = useForm<OrderFormData>({ resolver: zodResolver(orderSchema) });

  const onShoppingSubmit = async (formData: OrderFormData) => {
    // 1. Validation for Online Payment
    if (paymentMethod === 'online') {
      if (!clientSecret) {
        toast.error("Payment system is still loading. Please wait.");
        return;
      }
      if (!stripe || !elements) {
        toast.error("Stripe is not initialized.");
        return;
      }
    }

    setLoading(true);
    try {
      let paymentId = "COD-" + Date.now();

      // 2. Online Flow
      if (paymentMethod === 'online') {
        const { error: submitError } = await elements!.submit();
        if (submitError) throw new Error(submitError.message);

        const { error, paymentIntent } = await stripe!.confirmPayment({
          elements: elements!,
          clientSecret, // Passing explicitly to avoid "missing clientSecret" error
          confirmParams: { 
            return_url: `${window.location.origin}/ordersuccess`, 
          },
          redirect: 'if_required', 
        });

        if (error) throw new Error(error.message);
        
        if (paymentIntent && paymentIntent.status === 'succeeded') {
            paymentId = paymentIntent.id;
        } else {
            throw new Error("Payment was not successful");
        }
      }

      // 3. Database Save (Common)
      const dbRes = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            items: shoppingCart, 
            total: finalGrandTotal, 
            formData, 
            paymentMethod, 
            paymentId,
            orderType: 'shopping',
            status: paymentMethod === 'online' ? 'Paid' : 'Pending'
        }),
      });

      if (!dbRes.ok) throw new Error("Order could not be saved in database");
      
      toast.success("Order Placed Successfully! 🛒");
      clearShoppingCart();
      window.location.href = "/ordersucess";
      
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 mt-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-10 text-blue-600 font-black italic">
         <ShoppingBag size={32} /> <h1 className="text-4xl uppercase tracking-tighter">Secure Checkout</h1>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onShoppingSubmit)} className="grid lg:grid-cols-5 gap-10">
          
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <AddressForm />
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden">
                <CardHeader className="bg-slate-50 border-b p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Review Items</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {shoppingCart.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                                <div className="relative h-16 w-16 rounded-xl overflow-hidden border bg-white">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                                    <p className="text-xs text-slate-500 font-bold">{item.quantity} x ₹{item.price}</p>
                                </div>
                                <p className="font-black text-blue-600 italic">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden sticky top-24">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-center italic">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between font-bold text-slate-600 italic"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between font-bold text-slate-400 text-sm italic"><span>Shipping Fee</span><span>₹{shippingCharge}</span></div>
                <div className="flex justify-between font-bold text-slate-400 text-sm border-b border-dashed pb-4 italic"><span>Delivery Fee</span><span>₹{deliveryCharge}</span></div>
                
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-tighter">Total Payable</span>
                  <span className="text-4xl font-black italic tracking-tighter text-blue-600">₹{finalGrandTotal}</span>
                </div>

                <div className="pt-6 space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-3">
                        <Label htmlFor="cod" className={cn("flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", paymentMethod === 'cod' ? "border-blue-600 bg-blue-50" : "border-slate-100")}>
                            <div className="flex items-center gap-3"><RadioGroupItem value="cod" id="cod" /><span className="font-black text-xs uppercase tracking-widest">Cash on Delivery</span></div>
                            <Truck size={18} className={paymentMethod === 'cod' ? "text-blue-600" : "text-slate-300"} />
                        </Label>
                        <Label htmlFor="online" className={cn("flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", paymentMethod === 'online' ? "border-blue-600 bg-blue-50" : "border-slate-100")}>
                            <div className="flex items-center gap-3"><RadioGroupItem value="online" id="online" /><span className="font-black text-xs uppercase tracking-widest">Online Payment</span></div>
                            <CreditCard size={18} className={paymentMethod === 'online' ? "text-blue-600" : "text-slate-300"} />
                        </Label>
                    </RadioGroup>

                    {paymentMethod === 'online' && clientSecret && (
                        <div className="p-2 border-2 border-slate-100 rounded-[28px] bg-white animate-in slide-in-from-top-2 duration-300">
                            <PaymentElement options={{ layout: 'accordion' }} />
                        </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={loading || (paymentMethod === 'online' && !clientSecret)} 
                      className="w-full bg-blue-600 h-16 text-lg font-black rounded-3xl uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <div className="flex items-center gap-2">
                              {paymentMethod === 'online' && !clientSecret ? "Initializing..." : "Confirm Order"}
                              <CheckCircle2 size={20} />
                            </div>
                        )}
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default function ShoppingCheckoutPage() {
  const { getShoppingTotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const subtotal = getShoppingTotal();
  const total = subtotal + (subtotal > 0 ? 30 : 0) + (subtotal > 0 && subtotal < 500 ? 40 : subtotal >= 500 && subtotal <= 1000 ? 35 : 0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isMounted && total > 0) {
      fetch('http://localhost:5000/api/payment/create-intent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ amount: total }) 
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch intent");
        return res.json();
      })
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error("Stripe Fetch Error:", err));
    }
  }, [total, isMounted]);

  if (!isMounted) return null;

  return (
    <Elements 
      stripe={stripePromise} 
      options={clientSecret ? { 
        clientSecret, 
        appearance: { 
            theme: 'flat', 
            variables: { colorPrimary: '#2563eb', borderRadius: '16px' } 
        } 
      } : { mode: 'payment', amount: Math.max(1, Math.round(total * 100)), currency: 'inr' }}
    >
      <ShoppingCheckoutContent clientSecret={clientSecret || ""} />
    </Elements>
  );
}