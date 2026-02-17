import { Router, Request, Response } from "express";
import {
  dummyproducts,
  dummyMenu,
  dummyGrocery,
} from "../data/dummydata";

const router = Router();

type OrderItem = {
  type: "product" | "menu" | "grocery";
  itemId: number;
  quantity: number;
};

type Order = {
  id: number;
  items: any[];
  total: number;
  createdAt: Date;
};

let orders: Order[] = [];

/**
 * helper: get item by type
 */
const getItemByType = (type: string, id: number) => {
  if (type === "product") {
    return dummyproducts.find((p) => p.id === id);
  }
  if (type === "menu") {
    return dummyMenu.find((m) => m.id === id);
  }
  if (type === "grocery") {
    return dummyGrocery.find((g) => g.id === id);
  }
  return null;
};

/**
 * POST /api/orders
 */
router.post("/", (req: Request, res: Response) => {
  const { items }: { items: OrderItem[] } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items" });
  }

  let total = 0;

  const orderItems = items.map((item) => {
    const data = getItemByType(item.type, item.itemId);

    if (!data) return null;

    total += data.price * item.quantity;

    return {
      type: item.type,
      data,
      quantity: item.quantity,
    };
  }).filter(Boolean);

  const newOrder: Order = {
    id: orders.length + 1,
    items: orderItems,
    total,
    createdAt: new Date(),
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

/**
 * GET /api/orders
 */
router.get("/", (req: Request, res: Response) => {
  res.json(orders);
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

export default router;
