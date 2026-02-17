/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ProductList from '@/components/organisms/productlist';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Filter, SearchX, ArrowRight, Zap } from 'lucide-react';

export default function ShoppingPage() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const categoryFilter = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name?.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery);

      let matchesCategory = true;
      if (categoryFilter && product.category) {
        const normalizedProductCategory = product.category
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/&/g, 'and');
        matchesCategory = normalizedProductCategory === categoryFilter;
      }
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter, products]);

  const currentCategoryObj = products.find((p) => {
    if (!p.category) return false;
    const normalized = p.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    return normalized === categoryFilter;
  });

  const currentCategoryName = currentCategoryObj?.category || 'Exclusive Trends';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" size={32} />
        </motion.div>
        <div className="mt-8 text-white font-black italic tracking-[0.5em] text-xl">INITIALIZING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-24 selection:bg-blue-500 selection:text-white">
      
      {/* --- HERO SECTION: Modern Tech Aesthetic --- */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-[#020617] rounded-b-[100px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, 50, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[80%] bg-blue-600/30 blur-[140px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              x: [0, -80, 0], 
              y: [0, -60, 0],
              scale: [1, 1.3, 1] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-purple-600/20 blur-[140px] rounded-full" 
          />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-2xl px-5 py-2 rounded-full border border-white/10 mb-8 cursor-default shadow-2xl"
            >
              <Sparkles className="text-yellow-400 h-4 w-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-100 italic">Global Collection 2026</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-[110px] font-black italic tracking-tighter uppercase leading-[0.85] text-white">
              {categoryFilter ? (
                <motion.span layout>
                  GO <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 drop-shadow-2xl">
                    {currentCategoryName}
                  </span>
                </motion.span>
              ) : (
                <motion.span layout>
                  THE <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 drop-shadow-2xl">
                    FUTURE
                  </span>
                </motion.span>
              )}
            </h1>
            
            <p className="mt-8 text-slate-400 font-medium max-w-2xl mx-auto text-lg md:text-2xl tracking-tight leading-relaxed">
              Curating high-performance <span className="text-white italic font-black">Essentials</span> for the modern digital nomad. 
            </p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
            >
               <Button size="lg" className="group bg-blue-600 text-white hover:bg-blue-500 h-16 px-12 rounded-[24px] font-black italic text-xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-95" asChild>
                 <Link href="/shopping/cart">
                    MY BAG <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                 </Link>
               </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- INFO PANEL: Floating Glassmorphism --- */}
      <div className="container mx-auto px-6 -mt-16 relative z-30">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/70 backdrop-blur-3xl p-8 rounded-[45px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
              <motion.div 
                whileHover={{ rotate: 180 }}
                className="h-16 w-16 bg-[#020617] rounded-[22px] flex items-center justify-center text-white shadow-2xl"
              >
                <Filter size={24} />
              </motion.div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Live Inventory</p>
                <h3 className="text-2xl font-black italic text-slate-900 uppercase tracking-tighter">
                  {filteredProducts.length} <span className="text-blue-600">Items</span> Ready
                </h3>
              </div>
          </div>

          <AnimatePresence>
            {searchQuery && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 px-8 py-4 rounded-2xl shadow-xl"
              >
                 <p className="text-sm font-black italic text-blue-400 uppercase tracking-tight">
                   Matches for: <span className="text-white">&quot;{searchQuery}&quot;</span>
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- PRODUCT GRID SECTION --- */}
      <section className="container mx-auto px-6 py-24">
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 bg-white rounded-[70px] border-4 border-dashed border-slate-100 shadow-inner"
            >
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <SearchX size={56} className="text-slate-300" />
              </div>
              <h3 className="text-4xl font-black italic text-slate-900 uppercase tracking-tighter">No Matches Found</h3>
              <p className="text-slate-400 font-bold mt-3 mb-10 uppercase tracking-widest text-sm">Our sensors couldnot find what you are looking for</p>
              <Button variant="outline" className="h-16 px-12 rounded-2xl border-4 border-slate-900 font-black italic text-lg hover:bg-slate-900 hover:text-white transition-all shadow-xl" asChild>
                <Link href="/shopping">RESET DISCOVERY</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="product-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-16 px-2">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-12 bg-blue-600 rounded-full" />
                  <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900">
                    {searchQuery || categoryFilter ? 'Tailored Discovery' : 'Main Collection'}
                  </h2>
                </div>
                <ShoppingBag className="text-slate-200 hidden md:block" size={40} />
              </div>

              {/* Grid with stagger effect (handled inside ProductList or wrapped here) */}
              <div className="relative">
                <div className="absolute top-0 -left-10 w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                <ProductList products={filteredProducts} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}