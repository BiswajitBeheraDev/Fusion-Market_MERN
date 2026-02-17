import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    const filter = category ? { category: category.toString() } : {};
    
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Data fetch nahi ho paya", error });
  }
};