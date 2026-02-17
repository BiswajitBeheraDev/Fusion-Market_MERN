/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import Order from '../models/order'; 

const router = express.Router();

router.get('/userorders', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders || []);
  } catch (error) {
    console.error("GET Error:", error);
    res.status(500).json([]);
  }
});

router.patch('/userorders', async (req: Request, res: Response) => {
  try {
    const { orderId, newStatus, customer, ...otherData } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const updatePayload: any = { ...otherData };

    if (newStatus) {
      updatePayload.status = newStatus;
    }

    if (customer) {
      updatePayload.customer = customer;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updatePayload },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order nahi mila" });
    }

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error("PATCH Error:", error);
    res.status(500).json({ error: error.message || "Update failed" });
  }
});

export default router;