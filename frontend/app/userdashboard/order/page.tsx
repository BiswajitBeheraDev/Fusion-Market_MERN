/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, Fragment } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; 
import { Loader2, User, Maximize2, X, Save, Trash2, Package, MapPin, Phone } from "lucide-react";
import { toast } from 'sonner';
import { FormProvider, useForm } from "react-hook-form";
import { AddressForm } from '@/components/checkouts/Addressform';

const API_BASE_URL = 'http://localhost:5000/api';

export default function UserOrdersTablePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const methods = useForm();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/userorders`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data.reverse() : []); // Reverse for latest first
    } catch (err) {
      toast.error("Orders load nahi ho paye.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    if (selectedOrder) {
      methods.reset({
        ...selectedOrder.customer,
        orderId: selectedOrder._id,
      });
    }
  }, [selectedOrder, methods]);

  const onUpdateOrder = async (data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/userorders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: selectedOrder._id, 
          customer: { ...data } 
        }),
      });
      if (res.ok) {
        toast.success("Address Updated!");
        setIsEditMode(false);
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Order cancel karna hai?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/userorders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus: 'cancelled' }),
      });
      if (res.ok) {
        toast.success("Order Cancelled");
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (err) {
      toast.error("Cancellation failed");
    }
  };

  // Status Badge Logic
  const renderStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return <Badge className="bg-green-100 text-green-600 border-none px-3 uppercase text-[10px] font-black">Delivered</Badge>;
    if (s === 'shipped') return <Badge className="bg-orange-100 text-orange-600 border-none px-3 uppercase text-[10px] font-black">Shipped</Badge>;
    if (s === 'cancelled') return <Badge className="bg-red-100 text-red-600 border-none px-3 uppercase text-[10px] font-black">Cancelled</Badge>;
    if (s === 'processing') return <Badge className="bg-blue-100 text-blue-600 border-none px-3 uppercase text-[10px] font-black">Processing</Badge>;
    return <Badge className="bg-slate-100 text-slate-500 border-none px-3 uppercase text-[10px] font-black">Pending</Badge>;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white italic font-black text-blue-600">
      <Loader2 className="animate-spin mr-2" size={32} /> LOADING ORDERS...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-10 pt-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            My <span className="text-blue-600">orders</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Check your order status here</p>
        </div>

        <div className="rounded-[40px] border border-slate-100 overflow-hidden shadow-xl bg-white">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="font-black uppercase text-[11px] py-6 pl-10">Order</TableHead>
                <TableHead className="font-black uppercase text-[11px]">Coustmername</TableHead>
                <TableHead className="font-black uppercase text-[11px]">Address</TableHead>
                <TableHead className="font-black uppercase text-[11px] text-center">Amount</TableHead>
                <TableHead className="font-black uppercase text-[11px] text-center">Status</TableHead>
                <TableHead className="text-right pr-10 uppercase text-[11px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 font-black text-slate-300 italic uppercase">No orders found</TableCell></TableRow>
              ) : (
                orders.map((order, index) => (
                  <TableRow key={order._id} className="hover:bg-blue-50/30 transition-colors border-slate-50">
                    <TableCell className="font-black text-blue-600 italic py-6 pl-10">
                      #{index + 1} 
                   </TableCell>
                    <TableCell>
                      <p className="font-black text-slate-800 text-sm uppercase italic leading-none">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{order.items?.length} Items</p>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-slate-400 uppercase tracking-tight max-w-[150px] truncate">
                  {order.customer?.city}, {order.customer?.state}
                </TableCell>
                    <TableCell className="font-black text-slate-900 italic text-center">₹{order.total}</TableCell>
                    <TableCell className="text-center">
                      {renderStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(order); setIsEditMode(false); }} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl h-10 w-10 transition-all">
                        <Maximize2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      {selectedOrder && (
        <Fragment>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b flex justify-between items-center bg-white">
               <div className="flex items-center gap-3">
                 {/* Only show edit switch if order is not delivered/cancelled */}
                 {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                   <div className="flex items-center gap-2 bg-slate-50 p-2 px-4 rounded-xl border">
                    <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
                    <Label className="text-[9px] font-black uppercase text-orange-500">Edit Address</Label>
                   </div>
                 )}
               </div>
               <Button onClick={() => setSelectedOrder(null)} variant="ghost" className="rounded-full h-10 w-10 p-0 hover:rotate-90 transition-transform">
                 <X size={20} />
               </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 italic">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Package size={30} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-slate-900 uppercase tracking-tighter">Order Summary</h3>
                  <div className="mt-1">{renderStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              <FormProvider {...methods}>
                <form id="user-sidebar-form" onSubmit={methods.handleSubmit(onUpdateOrder)} className="space-y-6">
                  {isEditMode ? (
                    <div className="animate-in fade-in zoom-in-95 duration-300"><AddressForm /></div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-5 bg-slate-50 rounded-[30px] border-2 border-slate-100 space-y-4">
                        <div className="flex items-start gap-3">
                          <User size={16} className="text-blue-600 mt-1" />
                          <div>
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recipient</Label>
                            <p className="font-black text-slate-800 text-sm uppercase">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-blue-600 mt-1" />
                          <div>
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shipping To</Label>
                            <p className="font-bold text-slate-600 text-xs leading-relaxed uppercase">
                              {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pinCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone size={16} className="text-blue-600 mt-1" />
                          <div>
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</Label>
                            <p className="font-black text-slate-800 text-sm tracking-tighter">{selectedOrder.customer?.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </FormProvider>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Items in Parcel</Label>
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-xs font-black uppercase italic">{item.name} <span className="text-blue-600 ml-2">x{item.quantity}</span></span>
                    <span className="text-xs font-black text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 border-t bg-white space-y-5">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</span>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none mt-1">₹{selectedOrder.total}</p>
                </div>
                <Badge className="bg-blue-600 text-white font-black px-4 py-1.5 rounded-xl text-[9px] border-none italic uppercase">Online</Badge>
              </div>

              {isEditMode ? (
                <Button form="user-sidebar-form" type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-14 rounded-2xl italic tracking-tighter shadow-xl shadow-blue-100 uppercase">
                  {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Confirm Address Update
                </Button>
              ) : (
                selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => cancelOrder(selectedOrder._id)}
                    className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white border-none transition-all"
                  >
                    <Trash2 size={18} /> Request Cancellation
                  </Button>
                )
              )}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}