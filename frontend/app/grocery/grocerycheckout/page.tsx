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
import { Loader2, Truck, CreditCard, ShoppingBasket, ShieldCheck, Receipt, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function GroceryCheckoutContent({ clientSecret }: { clientSecret: string }) {
  const { groceryCart, getGroceryTotal, clearGroceryCart } = useCart();
  const subtotal = getGroceryTotal();
  const stripe = useStripe();
  const elements = useElements();

  const packagingFee = subtotal > 0 ? 20 : 0;
  const deliveryCharge = (subtotal > 0 && subtotal < 799) ? 50 : 0;
  const finalGrandTotal = subtotal + packagingFee + deliveryCharge;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const methods = useForm<OrderFormData>({ resolver: zodResolver(orderSchema) });

  const onOrderSubmit = async (formData: OrderFormData) => {
    if (paymentMethod === 'online' && (!clientSecret || !stripe || !elements)) {
      toast.error("Payment system is still loading...");
      return;
    }

    setLoading(true);
    try {
      let paymentId = "GROCERY-COD-" + Date.now();

      if (paymentMethod === 'online') {
        const { error: submitError } = await elements!.submit();
        if (submitError) throw new Error(submitError.message);

        const { error, paymentIntent } = await stripe!.confirmPayment({
          elements: elements!,
          clientSecret,
          confirmParams: { 
            return_url: `${window.location.origin}/ordersuccess`, 
          },
          redirect: 'if_required', 
        });

        if (error) throw new Error(error.message);
        if (paymentIntent?.status === 'succeeded') {
            paymentId = paymentIntent.id;
        } else {
            throw new Error("Payment was not successful");
        }
      }

      // API call to your backend
      const dbRes = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: groceryCart, 
          total: finalGrandTotal, 
          formData, 
          paymentMethod, 
          paymentId,
          orderType: 'grocery',
          status: paymentMethod === 'online' ? 'Paid' : 'Pending'
        }),
      });

      if (!dbRes.ok) throw new Error("Order save failed");
      
      toast.success("Groceries Booked! 🥦");
      clearGroceryCart();
      window.location.href = "/ordersucess";
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 uppercase italic flex items-center gap-3 text-emerald-700">
          <ShoppingBasket size={40} className="text-emerald-600" /> Finalize Your Basket
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onOrderSubmit)} className="grid lg:grid-cols-5 gap-8">
            
            <div className="lg:col-span-3 space-y-6">
              {/* Address Form */}
              <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden bg-white">
                <CardHeader className="bg-emerald-50 border-b p-6">
                  <CardTitle className="text-xs font-black uppercase text-emerald-700 tracking-widest flex items-center gap-2">
                    <Truck size={18} /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <AddressForm />
                </CardContent>
              </Card>

              {/* Added: Review Items Section */}
              <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden bg-white">
                <CardHeader className="bg-emerald-50 border-b p-6">
                  <CardTitle className="text-xs font-black uppercase text-emerald-700 tracking-widest flex items-center gap-2">
                    Review Groceries
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {groceryCart.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-white border">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                          <p className="text-xs text-slate-500">{item.quantity} x ₹{item.price}</p>
                        </div>
                        <p className="font-black text-emerald-700 italic">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <Card className="shadow-2xl border-none rounded-[40px] overflow-hidden bg-slate-900 text-white">
                  <CardHeader className="bg-white/5 border-b border-white/10 p-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 italic">
                      <Receipt size={18} /> Invoice Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-5">
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Items Subtotal</span>
                      <span className="text-white">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-400">
                      <span>Packaging Fee</span>
                      <span className="text-white">₹{packagingFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-400 border-b border-white/10 pb-4">
                      <span>Delivery Fee</span>
                      <span className={deliveryCharge === 0 ? "text-emerald-400" : "text-white"}>
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-3xl font-black pt-2 italic">
                      <span>To Pay</span>
                      <span className="text-emerald-400 tracking-tighter">₹{finalGrandTotal}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 shadow-2xl border-none rounded-[35px] bg-white">
                  <h3 className="text-sm font-black uppercase mb-4 italic text-slate-800 tracking-tight">Select Payment</h3>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)} className="grid gap-3">
                    <Label htmlFor="cod" className={cn("flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", paymentMethod === 'cod' ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100")}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-xs uppercase italic">Cash on Delivery</span>
                          <span className="text-[9px] text-slate-400 font-bold leading-none">Pay at doorstep</span>
                        </div>
                      </div>
                    </Label>

                    <Label htmlFor="online" className={cn("flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all", paymentMethod === 'online' ? "border-emerald-500 bg-emerald-50/50" : "border-slate-100")}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="online" id="online" />
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-xs uppercase italic">Online Payment</span>
                          <span className="text-[9px] text-slate-400 font-bold leading-none">Card / UPI / GPay</span>
                        </div>
                      </div>
                      <CreditCard size={16} className={paymentMethod === 'online' ? "text-emerald-600" : "text-slate-300"} />
                    </Label>
                  </RadioGroup>

                  {paymentMethod === 'online' && clientSecret && (
                    <div className="mt-4 p-3 border-2 border-emerald-100 rounded-2xl bg-white animate-in slide-in-from-top-2 duration-300">
                      <PaymentElement options={{ layout: 'accordion' }} />
                    </div>
                  )}
                </Card>

                <Button 
                  type="submit" 
                  disabled={loading || (paymentMethod === 'online' && !clientSecret)} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-16 text-lg font-black rounded-[25px] shadow-xl shadow-emerald-100 uppercase tracking-widest transition-transform active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <div className="flex items-center gap-2">
                       {paymentMethod === 'online' && !clientSecret ? "Initializing..." : "Place Order"}
                       <CheckCircle2 size={20} />
                    </div>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Safe & Secure Freshness</span>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function GroceryCheckoutPage() {
  const { groceryCart, getGroceryTotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const subtotal = getGroceryTotal();
  const total = subtotal + (subtotal > 0 ? 20 : 0) + (subtotal > 0 && subtotal < 799 ? 50 : 0);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isMounted && total > 0) {
      fetch('http://localhost:5000/api/payment/create-intent', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ amount: total }) 
      })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => console.error("Stripe Error:", err));
    }
  }, [total, isMounted]);

  if (!isMounted) return null;

  if (groceryCart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <ShoppingBasket size={40} />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800">Your basket is empty! 🥦</h2>
        <Button asChild className="bg-emerald-600 rounded-xl px-8 h-12 font-bold uppercase tracking-widest">
            <Link href="/grocery/menu">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={clientSecret ? { 
      clientSecret, 
      appearance: { 
        theme: 'flat', 
        variables: { colorPrimary: '#059669', borderRadius: '20px' } 
      } 
    } : { mode: 'payment', amount: Math.max(1, Math.round(total * 100)), currency: 'inr' }}>
      <GroceryCheckoutContent clientSecret={clientSecret || ""} />
    </Elements>
  );
}