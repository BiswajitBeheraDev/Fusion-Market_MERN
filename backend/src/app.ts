import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";

dotenv.config();

import productRoutes from "./routes/product.route";
import orderRoutes from "./routes/order.route"; 
import paymentRoutes from "./routes/payment.route";
import userRoute from "./routes/user.route";
import adminRoute from "./routes/admin.route";

import authRoutes from "./routes/auth.routes"

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", userRoute);
app.use("/api", adminRoute);

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend Server is Running! 🚀");
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

export default app;
