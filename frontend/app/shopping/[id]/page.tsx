/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Loader2, CheckCircle2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/app/context/cartcontext'; 

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cart context se functions nikaale
  const { shoppingCart, addToShoppingCart } = useCart();

  // Backend se product fetch karne ka effect
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Backend endpoint for general products
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        
        if (!response.ok) {
          setProduct(null);
          return;
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Agar product nahi mila
  if (!product) {
    notFound();
  }

  // Check if item is already in shopping cart
  const isInCart = shoppingCart.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Already in cart!", { description: product.name });
      return;
    }

    addToShoppingCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
    });

    toast.success("Added to Cart 🛒", {
      description: product.name,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button asChild variant="ghost" className="mb-8 font-bold hover:bg-white transition-all">
          <Link href="/shopping">
            <ArrowLeft className="mr-2 h-5 w-5 text-blue-600" /> Back to Shopping
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Image Section */}
          <div className="relative h-96 md:h-full min-h-[400px] overflow-hidden rounded-2xl bg-gray-50">
            <Image
              src={product.image || 'https://via.placeholder.com/600'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 italic uppercase">
                {product.name}
              </h1>

              {product.category && (
                <Badge variant="secondary" className="text-sm font-black italic px-4 py-1.5 mb-6 uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100">
                  {product.category}
                </Badge>
              )}

              <div className="flex items-baseline gap-3 mb-8">
                <p className="text-5xl font-black text-blue-600 italic">
                  ₹{product.price}
                </p>
                <p className="text-xl text-gray-300 line-through font-bold italic">
                  ₹{(product.price || 0) + 500}
                </p>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3 border-b pb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                  {product.description || 'Experience premium quality with our latest collection. Built for comfort and style.'}
                </p>
              </div>
            </div>

            <Button 
              size="lg" 
              className={`w-full text-xl py-10 rounded-2xl shadow-xl transition-all gap-4 font-black italic uppercase tracking-tighter ${
                isInCart 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.02]'
              }`}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? (
                <>
                  <CheckCircle2 className="h-7 w-7 text-green-500" />
                  Already in Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-7 w-7" />
                  Add to Cart
                </>
              )}
            </Button>
            
            {isInCart && (
              <Link href="/shopping/cart" className="text-center text-blue-600 font-black italic uppercase text-sm hover:underline">
                View Shopping Cart →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}