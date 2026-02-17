import { Router, Request, Response } from "express";
import Order from "../models/order"; 
import { dummyproducts, dummyMenu, dummyGrocery } from "../data/dummydata";

const router = Router();

const getItemDetails = (id: number) => {
  return dummyproducts.find(p => p.id === id) || 
         dummyMenu.find(m => m.id === id) || 
         dummyGrocery.find(g => g.id === id);
};

router.get("/track/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const id = String(req.params.id);
    console.log("🔍 Searching for Order:", id);

    const order = await Order.findOne({
      $or: [
        { orderId: id },
        { orderId: `ORD-${id}` },
        { orderId: { $regex: new RegExp(id, 'i') } } 
      ]
    }).lean();

    if (!order) {
      return res.status(404).json({ error: "Order ID DB mein nahi mili!" });
    }

    return res.json(order);
  } catch (error) {
    console.error("❌ Track Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
});

// CHECKOUT ROUTE
router.post("/checkout", async (req: Request, res: Response): Promise<any> => {
  try {
    const { items, total, formData, paymentMethod, orderType, paymentId, status } = req.body;

    if (!items || !formData) {
        return res.status(400).json({ error: "Required fields missing" });
    }

    const formattedAddress = formData.addresses
      ? formData.addresses.map((addr: any) => addr.addressLine).join(" | ")
      : `${formData.city}, ${formData.state} - ${formData.pinCode}`;

    const orderData = {
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: paymentId || null,
      total: Number(total),
      items: items.map((item: any) => {
        const details = getItemDetails(item.id);
        return {
          id: item.id,
          name: details?.name || item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || ""
        };
      }),
      status: status || "pending",
      paymentMethod,
      orderType,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName || "",
        phone: formData.phone,
        email: formData.email || "No email",
        address: formattedAddress,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
      },
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, orderId: savedOrder.orderId, order: savedOrder });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ error: "Checkout Failed" });
  }
});

// GET ALL ORDERS
router.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

export default router;