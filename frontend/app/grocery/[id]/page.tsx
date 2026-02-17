/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, CheckCircle2, Apple, Scale, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/app/context/cartcontext'; 

export default function GroceryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const groceryId = resolvedParams.id;

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Context se groceryCart aur addToGroceryCart nikaala
  const { groceryCart, addToGroceryCart } = useCart();

  useEffect(() => {
    const fetchGroceryDetails = async () => {
      try {
        setLoading(true);
        // Grocery specific backend endpoint (check if your route is /api/grocery/:id or /api/products/:id)
        const response = await fetch(`http://localhost:5000/api/products/${groceryId}`);
        
        if (!response.ok) {
          setItem(null);
          return;
        }

        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching grocery details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryDetails();
  }, [groceryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  // Check if item is already in grocery cart
  const isInCart = groceryCart?.some((cartItem) => cartItem.id === item.id);

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Already in your bag! 🛒", {
        description: `${item.name} is waiting in your grocery list.`,
      });
      return;
    }

    addToGroceryCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      // description add kar sakte ho agar CartItem type support karta hai
    });

    toast.success("Added to Grocery Cart 🍎", {
      description: `${item.name} has been added.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button asChild variant="ghost" className="mb-8 hover:bg-green-50 font-bold italic transition-colors">
          <Link href="/grocery">
            <ArrowLeft className="mr-2 h-5 w-5 text-green-600" /> Back to Store
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-[2.5rem] shadow-2xl shadow-green-100/50 border border-gray-100 p-6 md:p-10">
          {/* Image Section */}
          <div className="relative h-80 md:h-[500px] overflow-hidden rounded-3xl shadow-inner bg-gray-50 group">
            <Image
              src={item.image || 'https://via.placeholder.com/600'}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            
            <div className="absolute top-6 left-6">
               <Badge className="bg-green-600 text-white border-none px-4 py-1.5 font-black italic shadow-lg">
                 {item.category?.toUpperCase() || 'FRESH'}
               </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                 <Apple className="h-6 w-6 text-green-500" />
                 <span className="text-sm font-black italic text-gray-400 uppercase tracking-[0.2em]">Fresh Grocery</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black italic text-gray-900 leading-tight tracking-tighter">
                {item.name}
              </h1>

              <div className="flex items-center gap-4 mt-6">
                <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-2">
                   <Scale className="h-5 w-5 text-green-600" />
                   <span className="font-black italic text-green-700">{item.unit || 'Standard Unit'}</span>
                </div>
              </div>

              <div className="mt-8 flex items-baseline gap-3">
                <span className="text-5xl font-black text-green-600">₹{item.price}</span>
                <span className="text-gray-300 font-bold line-through text-xl">₹{(item.price || 0) + 40}</span>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-black italic uppercase tracking-widest text-gray-400 mb-3 border-b pb-2">Product Info</h2>
                <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                  {item.description || 'Sourced directly from organic farms. Guaranteed fresh and high quality for your healthy lifestyle.'}
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-4 space-y-4">
              <Button 
                size="lg" 
                className={`w-full text-xl py-10 rounded-3xl shadow-2xl transition-all gap-4 font-black italic uppercase tracking-tighter ${
                  isInCart 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] shadow-green-200'
                }`}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    Already In Bag
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-8 w-8" />
                    Add to Bag
                  </>
                )}
              </Button>

              {isInCart && (
                <Button asChild variant="link" className="w-full text-green-600 font-black italic uppercase text-sm">
                  <Link href="/grocery/cart">Go to Checkout →</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}