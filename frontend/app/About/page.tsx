 
'use client';

import { motion } from 'framer-motion';
import { Truck, Rocket, HeartHandshake, Box, Lightbulb, Globe, Star, Clock } from "lucide-react";

export default function AboutUs() {
  const leftServices = [
    { 
      icon: <Truck size={24} />, 
      title: "Zero-Fast Logistics", 
      desc: "Order logistics technology ensure karta hai ki aapka order lightning speed se pahuche.",
      color: "border-orange-500",
      btn: "PAST M024"
    },
    { 
      icon: <Truck size={24} />, 
      title: "Zero-Lag Delivery", 
      desc: "Order item verified se lekar fast delivery tak, hum har step par efficiency ensure karte hain.",
      color: "border-orange-500",
      btn: "PAST M024"
    },
    { 
      icon: <HeartHandshake size={24} />, 
      title: "Curated Quality", 
      desc: "Suur items verified ki aapka har order best standards par deliver ho.",
      color: "border-orange-500",
      btn: "PAST MORE"
    },
  ];

  return (
    <div className="min-h-screen bg-[#E2E8F0] text-slate-900 selection:bg-orange-500 selection:text-white pb-20 overflow-hidden relative font-sans">
      
      {/* Background Subtle Globe Effect */}
      <div className="absolute top-5 right-5 opacity-10 hidden lg:block">
         <Globe size={300} strokeWidth={0.5} className="text-slate-400" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16">
        
        {/* --- HERO HEADING --- */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[90px] font-black italic tracking-tighter leading-[0.85] uppercase text-slate-900"
          >
            DESIGN&apos;S <span className="text-slate-800">DESIGNING BEYOND</span> <br />
            FUTURE, <span className="text-orange-600">FUTURE.</span>
          </motion.h1>

          <motion.div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-200 mt-10">
            <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <Lightbulb size={12} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usges Gen soppirtg</span>
          </motion.div>
        </div>

        {/* --- MAIN BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column */}
          <div className="md:col-span-4 space-y-6">
            {leftServices.map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className={`bg-white p-8 rounded-[40px] border-2 ${s.color} shadow-lg relative overflow-hidden`}
              >
                <div className="bg-blue-600 h-11 w-11 rounded-xl flex items-center justify-center text-white mb-4">
                  {s.icon}
                </div>
                <h4 className="text-2xl font-black italic text-slate-900 mb-2 leading-none">{s.title}</h4>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed mb-5">{s.desc}</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase italic shadow-md">
                  {s.btn}
                </button>
              </motion.div>
            ))}
          </div>

          {/* --- CENTER 3D ROCKET CARD (Fixed Height & Alignment) --- */}
          <div className="md:col-span-4 bg-white rounded-[60px] p-8 shadow-2xl flex flex-col items-center justify-center border-2 border-white relative overflow-hidden h-full max-h-[550px] self-center">
             <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-ping" />
             <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
             
             <motion.div 
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 2, -2, 0]
                }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center"
             >
                <Rocket size={120} className="text-blue-600 fill-blue-500 drop-shadow-[0_20px_20px_rgba(37,99,235,0.3)]" />
             </motion.div>

             <div className="mt-10 space-y-3 w-3/4">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-slate-300" />
                </div>
                <div className="h-1.5 w-2/3 bg-slate-100 rounded-full overflow-hidden mx-auto">
                    <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} className="h-full bg-slate-300" />
                </div>
             </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 space-y-6">
            <motion.div className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-transparent hover:border-orange-500 transition-all group">
              <div className="bg-orange-600 h-11 w-11 rounded-xl flex items-center justify-center text-white mb-4 group-hover:rotate-12 transition-transform">
                <Star size={22} className="fill-white" />
              </div>
              <h4 className="text-2xl font-black italic text-slate-900 mb-2">Curated Quality</h4>
              <p className="text-slate-500 text-[11px] font-bold mb-5 italic">Leder hbim ecurvs asiata hei Hum woka order beet quality.</p>
              <button className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase italic shadow-md">
                PAST M024
              </button>
            </motion.div>

            <motion.div className="bg-white p-8 rounded-[40px] shadow-lg border-2 border-blue-500 relative">
              <div className="bg-emerald-500 h-9 w-16 rounded-xl flex items-center justify-center text-white text-[12px] font-black mb-4 shadow-md">95%</div>
              <h4 className="text-2xl font-black italic text-slate-900 mb-2 leading-none">Premium Exoplinty</h4>
              <p className="text-slate-500 text-[11px] font-bold mb-5 italic">Sular itom veritxles deliver ho standard par.</p>
              <div className="flex items-center gap-3">
                <button className="bg-orange-500 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase italic shadow-md">
                    ROIST MORE
                </button>
                <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                    -10
                </div>
              </div>
            </motion.div>

            {/* Bottom Dark Block */}
            <div className="bg-[#0F172A] rounded-[45px] p-8 flex items-center justify-between text-white shadow-2xl group transition-all">
               <div className="bg-white/10 p-5 rounded-2xl shadow-xl">
                  <Box className="text-orange-600 group-hover:scale-110 transition-transform" size={32} />
               </div>
               <div className="text-right flex flex-col items-end">
                  <p className="text-xl font-black italic leading-none mb-4">Premium Exoplinty</p>
                  <div className="flex items-center gap-3">
                    <button className="bg-white text-slate-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase italic">ROST MORE</button>
                    <div className="bg-orange-600 h-10 w-10 rounded-full flex items-center justify-center border-2 border-[#0F172A]">
                      <Clock size={18} />
                    </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}