/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, CheckCircle2, Leaf, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/app/context/cartcontext'; 

export default function FoodDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const foodId = resolvedParams.id;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FIXED: addToGroceryCart ko bhi destructure kiya aur addToFoodCart ka sahi use ensure kiya
  const { foodCart, addToFoodCart, addToGroceryCart } = useCart();

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${foodId}`);
        
        if (!response.ok) {
          setItem(null);
          return;
        }

        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching food details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const isInCart = foodCart.some((cartItem) => cartItem.id === item.id);

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Already in your cart! 🍲", {
        description: `${item.name} is waiting for checkout.`,
      });
      return;
    }

    // FIXED: Food page hai isliye addToFoodCart use kiya
    addToFoodCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      veg: item.veg || false
    });

    toast.success("Added to Food Cart 😋", {
      description: `${item.name} has been added.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button asChild variant="ghost" className="mb-8 hover:bg-orange-50 font-bold italic">
          <Link href="/food/menu">
            <ArrowLeft className="mr-2 h-5 w-5 text-orange-600" /> Back to Menu
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-10">
          <div className="relative h-80 md:h-[450px] overflow-hidden rounded-2xl shadow-inner bg-gray-50">
            <Image
              src={item.image || 'https://via.placeholder.com/600'}
              alt={item.name}
              fill
              className="object-cover transition-transform hover:scale-105 duration-500"
              priority
            />
            <div className="absolute top-4 left-4">
               <Badge className={`${item.veg ? 'bg-green-600' : 'bg-red-600'} text-white border-none px-3 py-1 font-black italic`}>
                 {item.veg ? 'VEG' : 'NON-VEG'}
               </Badge>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <Leaf className={`h-5 w-5 ${item.veg ? 'text-green-500' : 'text-red-500'}`} />
                 <span className="text-sm font-black italic text-gray-400 uppercase tracking-widest">Delicious Food</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black italic text-gray-900 leading-tight">
                {item.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-orange-600">₹{item.price}</span>
                <span className="text-gray-400 font-bold line-through text-lg">₹{(item.price || 0) + 100}</span>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-black italic uppercase tracking-tighter text-gray-500 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                  {item.description || 'This delicious dish is prepared with fresh ingredients and authentic spices.'}
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <Button 
                size="lg" 
                className={`w-full text-xl py-8 rounded-2xl shadow-lg transition-all gap-4 font-black italic uppercase tracking-tighter ${
                  isInCart 
                  ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-none' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
                onClick={handleAddToCart}
              >
                {isInCart ? (
                  <>
                    <CheckCircle2 className="h-7 w-7" />
                    Already In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-7 w-7" />
                    Add to Cart
                  </>
                )}
              </Button>

              {isInCart && (
                <Button asChild variant="link" className="w-full text-orange-600 font-black italic uppercase">
                  <Link href="/food/foodcart">View Full Cart →</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}