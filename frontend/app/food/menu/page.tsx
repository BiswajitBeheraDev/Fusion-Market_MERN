/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UtensilsCrossed, Sparkles, SearchX, ShoppingCart, Eye, Zap, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

import { useCart } from '@/app/context/cartcontext';

export default function FoodMenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { foodCart, addToFoodCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products/menu/all');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Food menu fetch error:", error);
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.veg === true;
      return matchesSearch && matchesVeg;
    });
  }, [searchQuery, isVegOnly, menuItems]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative h-24 w-24 border-t-4 border-orange-500 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-orange-500 font-black italic tracking-[0.4em] text-xl"
        >
          PREPARING MASTERPIECES...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-24 selection:bg-orange-500 selection:text-white">
      
      {/* --- HERO SECTION: Cinematic Dining --- */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-[#020617] rounded-b-[100px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-[-10%] left-[-5%] w-[60%] h-[80%] bg-orange-600/30 blur-[140px] rounded-full" 
          />
          <motion.div 
            animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[70%] bg-red-600/20 blur-[130px] rounded-full" 
          />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:30px_30px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl px-6 py-2.5 rounded-full border border-white/10 mb-8 shadow-2xl">
              <Flame className="text-orange-500 h-4 w-4 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-100 italic">Chefs Signature Collection 2026</span>
            </div>
            
            <h1 className="text-6xl md:text-[115px] font-black italic tracking-tighter uppercase leading-[0.8] text-white">
              CRAVE <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 drop-shadow-2xl">IT.</span> <br />
              <span className="opacity-40">ORDER</span> <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-orange-400">IT.</span>
            </h1>
            
            <p className="mt-8 text-slate-400 font-medium max-w-2xl mx-auto text-lg md:text-2xl tracking-tight leading-relaxed">
              Elevate your taste buds with our <span className="text-white font-black italic underline decoration-orange-500 decoration-4">Next-Gen</span> culinary experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SEARCH & FILTER: Glass Panel --- */}
      <div className="container mx-auto px-6 -mt-16 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/70 backdrop-blur-3xl p-8 rounded-[45px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <Input
              placeholder="HUNGRY? SEARCH YOUR DISH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-8 py-9 text-lg font-black italic rounded-[28px] border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-orange-500/50 shadow-inner tracking-tight placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-8 bg-slate-900 px-10 py-5 rounded-[28px] shadow-2xl w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Filters</span>
              <span className={`text-sm font-black italic uppercase ${isVegOnly ? 'text-green-400' : 'text-orange-400'}`}>
                {isVegOnly ? 'Pure Veg' : 'Global Mix'}
              </span>
            </div>
            <Switch 
              checked={isVegOnly} 
              onCheckedChange={setIsVegOnly} 
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-700 h-8 w-14" 
            />
          </div>
        </motion.div>
      </div>

      {/* --- MENU GRID --- */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 180 }}
              className="h-16 w-16 bg-orange-600 rounded-[22px] flex items-center justify-center text-white shadow-2xl"
            >
              <UtensilsCrossed size={32} />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900">The Menu</h2>
          </div>
          <Zap className="text-slate-200 hidden md:block" size={48} />
        </div>

        <AnimatePresence mode="wait">
          {filteredMenu.length === 0 ? (
            <motion.div 
              key="no-res" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-center py-32 bg-white rounded-[70px] border-4 border-dashed border-slate-100 shadow-inner"
            >
              <SearchX size={72} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">Kitchen is Silent</h3>
              <p className="text-slate-400 font-bold mt-2">Try searching for something else!</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
              {filteredMenu.map((item) => {
                const isInCart = foodCart.some((c: any) => c.id === item.id);
                return (
                  <motion.div 
                    key={item.id} 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -15 }}
                    className="group bg-white rounded-[60px] p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]"
                  >
                    {/* Badge */}
                    <div className="absolute top-10 right-10 z-20">
                      <div className={`h-4 w-4 rounded-full border-2 ${item.veg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center bg-white p-0.5 shadow-sm`}>
                        <div className={`h-full w-full rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>

                    <div className="relative h-72 w-full overflow-hidden rounded-[45px] bg-slate-100">
                      <Image 
                        src={item.image || 'https://via.placeholder.com/400'} 
                        alt={item.name} 
                        fill 
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                      />
                      
                      {/* Floating Info */}
                      <div className="absolute top-6 left-6">
                        <span className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black uppercase italic text-white border border-white/20">
                          {item.veg ? 'Green Earth' : 'Bold Flavor'}
                        </span>
                      </div>

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <Link href={`/food/${item.id}`}>
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl"
                          >
                            <Eye className="h-7 w-7 text-slate-900" />
                          </motion.div>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-10 px-3">
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[14px] font-bold text-slate-400 mt-3 line-clamp-2 leading-relaxed italic opacity-80">
                        {item.description || "Discover a symphony of flavors in every bite."}
                      </p>

                      <div className="mt-8 flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1 italic">Premium Price</span>
                          <span className="text-4xl font-black text-slate-900 italic tracking-tighter">₹{item.price}</span>
                        </div>
                        <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase italic border border-orange-100">
                          Hot Pick
                        </div>
                      </div>

                      <div className="mt-10 flex items-center gap-4">
                        <Button 
                          onClick={() => { if(!isInCart) { addToFoodCart(item); toast.success(`${item.name} added!`); } }}
                          className={`flex-1 h-16 rounded-[28px] font-black italic uppercase tracking-widest text-lg transition-all shadow-xl active:scale-95 ${
                            isInCart 
                              ? 'bg-slate-100 text-slate-400 cursor-default' 
                              : 'bg-slate-900 text-white hover:bg-orange-600 hover:shadow-orange-200'
                          }`}
                        >
                          {isInCart ? 'ORDERED' : <span className="flex items-center gap-3"><ShoppingCart size={20} /> GRAB IT</span>}
                        </Button>

                        <Link href={`/food/${item.id}`}>
                          <motion.div 
                            whileTap={{ scale: 0.9 }}
                            className="h-16 w-16 rounded-[28px] border-4 border-slate-50 bg-white flex items-center justify-center shadow-lg cursor-pointer hover:border-blue-100 group/icon"
                          >
                            <Sparkles className="h-7 w-7 text-blue-500 group-hover:scale-110 transition-transform" />
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}