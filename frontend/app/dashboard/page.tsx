/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  UtensilsCrossed,
  Apple,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

type UserType = {
  name?: string;
  email?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      id: "food",
      title: "HOT & READY",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900",
      color: "from-orange-500 to-red-600",
      icon: <UtensilsCrossed className="w-5 h-5" />,
      link: "/food/menu"
    },
    {
      id: "shopping",
      title: "NEW ARRIVALS",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900",
      color: "from-indigo-500 to-blue-600",
      icon: <ShoppingBag className="w-5 h-5" />,
      link: "/shopping"
    },
    {
      id: "grocery",
      title: "FRESH & ORGANIC",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=900",
      color: "from-green-500 to-emerald-600",
      icon: <Apple className="w-5 h-5" />,
      link: "/grocery/menu"
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      {/* 🌌 Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 md:px-12 py-8">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10"
        >
          <Sparkles className="text-yellow-400 w-5 h-5 animate-spin-slow" />
          <span className="text-sm md:text-base font-bold italic tracking-tight">
            Hey, <span className="text-yellow-300 capitalize">{user?.email?.split("@")[0] || "User"}</span>
          </span>
        </motion.div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-4 md:mt-10 pb-20">
        
        {/* Left Side: Text & Actions */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center lg:text-left space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
              ALL YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
                DAILY NEEDS
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience the future of shopping. Food, Grocery, and Premium products delivered to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
            {slides.map((btn) => (
              <Button
                key={btn.id}
                asChild
                className={`h-16 rounded-2xl bg-gradient-to-br ${btn.color} hover:scale-105 transition-all duration-300 shadow-lg shadow-black/20 border-t border-white/20 font-bold italic uppercase tracking-tighter`}
              >
                <Link href={btn.link} className="flex items-center justify-center gap-2">
                  {btn.icon} {btn.id}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Stylish Circle Slider */}
        <div className="relative flex justify-center items-center h-[350px] md:h-[500px]">
          {/* Decorative Outer Rings */}
          <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-spin-slow scale-110" />
          <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-reverse-spin" />

          <AnimatePresence mode="wait">
            <motion.div
              key={slides[index].id}
              initial={{ rotate: 15, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -15, opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.7, ease: "circOut" }}
              className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] z-20"
            >
              <div className="w-full h-full rounded-[60px] md:rounded-[100px] overflow-hidden border-[6px] md:border-[12px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-800">
                <img
                  src={slides[index].image}
                  alt={slides[index].title}
                  className="w-full h-full object-cover brightness-90 hover:scale-110 transition-transform duration-[2000ms]"
                />
              </div>

              {/* Float Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 md:py-4 rounded-3xl whitespace-nowrap shadow-2xl flex items-center gap-3`}
              >
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${slides[index].color} animate-ping`} />
                <span className="font-black italic uppercase tracking-tighter text-sm md:text-base">
                  {slides[index].title}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Dots */}
          <div className="absolute bottom-[-40px] flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-yellow-400' : 'w-2 bg-white/20'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 20s linear infinite;
        }
      `}</style>
    </main>
  );
}