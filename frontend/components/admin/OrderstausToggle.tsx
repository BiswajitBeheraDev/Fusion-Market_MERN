/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface OrderStatusProps {
  orderId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export function OrderStatusToggle({ orderId, currentStatus, onUpdate }: OrderStatusProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/userorders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (!res.ok) throw new Error("Update Failed");

      toast.success(`Status: ${newStatus.toUpperCase()}`);
      onUpdate(); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toast.error("Backend Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {loading && <Loader2 className="h-4 w-4 animate-spin text-orange-600" />}
      <Select defaultValue={currentStatus?.toLowerCase()} onValueChange={handleStatusChange} disabled={loading}>
        {/* Added bg-white to trigger and relative positioning */}
        <SelectTrigger className="w-[140px] h-9 text-[10px] font-black uppercase italic border-2 rounded-xl bg-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        
        {/* Main Fix: Added position="popper", solid bg, and z-index */}
        <SelectContent 
          position="popper" 
          sideOffset={4}
          className="bg-white border-2 shadow-2xl rounded-xl z-[9999] min-w-[140px]"
        >
          <SelectItem value="pending" className="text-[10px] font-bold uppercase py-2 cursor-pointer focus:bg-orange-50">
            Pending ⏳
          </SelectItem>
          <SelectItem value="processing" className="text-[10px] font-bold uppercase py-2 cursor-pointer focus:bg-orange-50">
            Processing ⚙️
          </SelectItem>
          <SelectItem value="shipped" className="text-[10px] font-bold uppercase py-2 cursor-pointer focus:bg-orange-50">
            Shipped 🚚
          </SelectItem>
          <SelectItem value="delivered" className="text-[10px] font-bold uppercase py-2 cursor-pointer focus:bg-orange-50 text-green-600">
            Delivered ✅
          </SelectItem>
          <SelectItem value="cancelled" className="text-[10px] font-bold uppercase py-2 cursor-pointer focus:bg-orange-50 text-red-600">
            Cancelled ❌
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}