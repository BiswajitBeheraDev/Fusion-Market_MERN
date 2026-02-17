import express from 'express';
import Order from '../models/order'; 

const router = express.Router();

router.get('/userorders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Orders nahi mil paye", error: error.message });
  }
});

router.patch('/userorders', async (req, res) => {
  try {
    const { orderId, customer, newStatus } = req.body;
    
    const updateData = newStatus 
      ? { status: newStatus } 
      : { customer: customer };

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      updateData, 
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: "Update fail ho gaya", error: error.message });
  }
});

export default router;