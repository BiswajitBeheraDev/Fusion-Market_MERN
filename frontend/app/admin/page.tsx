/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Fragment, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw, Maximize2, X, Save, ShieldCheck, User } from "lucide-react";
import { OrderStatusToggle } from '@/components/admin/OrderstausToggle';
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form"; 
import { AddressForm } from '@/components/checkouts/Addressform'; 

// Backend URL constant
const API_URL = 'http://localhost:5000/api/userorders';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      state: '',
      pinCode: '',
      addresses: [{ addressLine: '' }]
    }
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Yahan data ko reverse kar rahe hain taaki naya order upar dikhe
      setOrders(Array.isArray(data) ? [...data].reverse() : []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Data load nahi ho raha!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Sync Form with Selected Order Data
  useEffect(() => {
    if (selectedOrder) {
      methods.reset({
        ...selectedOrder.customer,
        addresses: [{ addressLine: selectedOrder.customer?.address || "" }]
      });
    }
  }, [selectedOrder, methods]);

  const onFormSubmit = async (formData: any) => {
    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          customer: {
            ...formData,
            address: formData.addresses?.[0]?.addressLine || formData.address
          }
        }),
      });

      if (res.ok) {
        toast.success("Database Updated Successfully!");
        setIsEditMode(false);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        throw new Error("Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error updating order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white italic font-black text-orange-600">
       <Loader2 className="animate-spin mb-2" size={48} />
       <p className="ml-4 uppercase tracking-tighter">Fetching Orders...</p>
    </div>
  );

  return (
    <div className="p-2 md:p-8 bg-gray-50/50 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-2 italic uppercase">
            ADMIN <ShieldCheck className="text-orange-600" size={36} />
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Live Order Control</p>
        </div>
        <Button onClick={fetchOrders} size="sm" variant="outline" className="bg-white rounded-xl border-2 hover:bg-orange-50 font-black shadow-sm italic text-xs h-10 px-5 transition-all active:scale-95">
          <RefreshCcw size={16} className="mr-2" /> REFRESH DATA
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100/50">
              <TableRow className="border-none">
                <TableHead className="font-black text-[10px] uppercase text-center w-[100px] py-6">Order No.</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Customer Name</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Address</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center">Amount</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center">Order Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase pr-10">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 font-black text-slate-300 italic uppercase">No orders found in database</TableCell></TableRow>
              ) : (
                orders.map((order: any, index: number) => (
                  <TableRow key={order._id} className="hover:bg-orange-50/30 transition-colors border-b border-gray-100">
                    {/* Indexing Logic: Yeh total length se subtract karke reverse number dikhayega */}
                    <TableCell className="font-black text-xs text-blue-600 italic text-center py-6">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="font-black text-gray-800 text-sm italic uppercase">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </TableCell>
                    <TableCell className="text-[10px] text-gray-400 font-bold uppercase italic max-w-[180px] truncate">
                      {order.customer?.city}, {order.customer?.state}
                    </TableCell>
                    <TableCell className="font-black text-sm text-gray-900 text-center italic">₹{order.total}</TableCell>
                   <TableCell className="text-center">
                    <div className="flex justify-center">
                      <OrderStatusToggle orderId={order._id} currentStatus={order.status} onUpdate={fetchOrders} />
                    </div>
                  </TableCell>
                    <TableCell className="text-right pr-10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setSelectedOrder(order); setIsEditMode(false); }} 
                        className="hover:bg-black hover:text-white border-2 rounded-xl transition-all h-10 w-10"
                      >
                        <Maximize2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* SIDEBAR DRAWER */}
      {selectedOrder && (
        <Fragment>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[40px]">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50 rounded-tl-[40px]">
              <div className="flex items-center space-x-3 bg-white p-2 px-4 rounded-2xl border-2 shadow-sm">
                <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
                <Label className="text-[10px] font-black uppercase text-orange-600">Edit Mode</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-xl border bg-white shadow-sm hover:rotate-90 transition-all">
                <X size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 italic">
              <FormProvider {...methods}>
                <form id="admin-order-form" onSubmit={methods.handleSubmit(onFormSubmit)}>
                  {isEditMode ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300"><AddressForm /></div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="flex items-center gap-5 pb-6 border-b-2 border-dashed border-gray-100">
                        <div className="h-16 w-16 bg-orange-600 rounded-[22px] flex items-center justify-center text-white shadow-lg shadow-orange-100">
                          <User size={32} />
                        </div>
                        <div>
                          <h3 className="font-black text-2xl text-gray-800 uppercase tracking-tighter leading-none">
                            {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                          </h3>
                          <p className="text-[10px] font-bold text-blue-600 mt-2 uppercase tracking-tighter">Order ID: {selectedOrder._id}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Shipping Details</Label>
                        <div className="p-6 bg-orange-50/40 rounded-[30px] border-2 border-orange-100 font-bold text-sm text-gray-900 leading-relaxed shadow-sm">
                          {selectedOrder.customer?.address} <br/>
                          <span className="text-orange-600 uppercase">{selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pinCode}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Contact Phone</Label>
                          <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 font-bold text-gray-800 tracking-widest">{selectedOrder.customer?.phone}</div>
                        </div>

                        <div className="pt-4">
                           <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Items Summary</Label>
                           <div className="mt-2 space-y-2">
                              {selectedOrder.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between p-3 bg-white border-2 border-slate-50 rounded-xl">
                                  <span className="text-xs font-black uppercase italic">{item.name} x{item.quantity}</span>
                                  <span className="text-xs font-black text-slate-900">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </FormProvider>
            </div>

            <div className="p-8 border-t bg-white rounded-b-[40px]">
              {isEditMode ? (
                <Button form="admin-order-form" type="submit" disabled={saving} className="w-full bg-black hover:bg-orange-600 text-white font-black h-14 rounded-2xl shadow-xl transition-all italic uppercase">
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} SAVE TO DATABASE
                </Button>
              ) : (
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-[32px] border-2 border-dashed border-gray-200">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase italic">Invoice Total</span>
                    <p className="text-4xl font-black text-black italic tracking-tighter leading-none mt-1">₹{selectedOrder.total}</p>
                  </div>
                  <Badge className="bg-green-600 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase border-none">PAID</Badge>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}