'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner'; // Sonner import ensure karein
import { ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { useCart } from '@/app/context/cartcontext';
import { motion } from 'framer-motion';

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
};

export default function ProductCard({ id, name, price, image, category, description }: ProductCardProps) {
  const { shoppingCart, addToShoppingCart } = useCart();
  
  // Checking if item is in shopping cart
  const isAlreadyAdded = shoppingCart.some((item) => item.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Kisi bhi Link action ko prevent karne ke liye
    
    if (isAlreadyAdded) {
      // --- TOAST: ALREADY ADDED ---
      toast.info('Item is already in your bag!', { 
        description: `${name} is waiting for you in the cart.`,
        duration: 3000,
      });
      return;
    }

    // Adding data to the shopping cart
    addToShoppingCart({ id, name, price, image, category, description });
    
    // --- TOAST: SUCCESS ---
    toast.success('Added to Bag! 🔥', {
      description: `${name} has been added successfully.`,
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/shopping/cart'
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden bg-white border-none shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] transition-all duration-500 flex flex-col h-full">
        
        {/* Top Image Section */}
        <div className="relative h-72 w-full overflow-hidden p-4">
          <div className="relative h-full w-full rounded-[24px] overflow-hidden bg-slate-50">
            {image ? (
              <Image 
                src={image} 
                alt={name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300 font-black italic">NO IMAGE</div>
            )}
            
            <div className="absolute top-3 left-3 flex gap-2">
              {category && (
                <Badge className="bg-white/70 backdrop-blur-md text-slate-900 border-none font-black italic px-3 py-1 text-[10px] uppercase tracking-tighter shadow-sm">
                  {category}
                </Badge>
              )}
            </div>

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <Button asChild variant="secondary" className="rounded-full w-12 h-12 p-0 shadow-xl border-none">
                <Link href={`/shopping/${id}`}><Eye size={20} /></Link>
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="px-6 pb-2 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic line-clamp-1 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </div>
          
          <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">
            {description || "Explore this premium product from our collection."}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter text-slate-900 italic">₹{price}</span>
            <span className="text-[10px] text-green-600 font-black uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">Special Price</span>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          {/* Button is clickable even if added, to show the "Already Added" toast */}
          <Button 
            variant="default" 
            onClick={handleAddToCart} 
            className={`flex-1 h-14 rounded-2xl font-black italic uppercase tracking-tighter text-sm transition-all duration-300 ${
                isAlreadyAdded 
                ? "bg-blue-50 text-blue-500 hover:bg-blue-100" 
                : "bg-slate-900 hover:bg-blue-600 text-white shadow-lg active:scale-95"
            }`}
          >
            {isAlreadyAdded ? (
              <span className="flex items-center gap-2">IN YOUR BAG</span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart size={18} /> Buy Now
              </span>
            )}
          </Button>
          
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button asChild variant="outline" className="h-14 w-14 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-colors">
                <Link href={`/shopping/${id}`}><Sparkles size={20} className="text-blue-500" /></Link>
            </Button>
          </motion.div>
        </CardFooter>

        <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
      </Card>
    </motion.div>
  );
}