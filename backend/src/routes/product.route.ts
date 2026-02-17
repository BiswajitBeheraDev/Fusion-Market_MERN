import { Router, Request, Response } from "express";
import {
  dummyproducts,
  dummyMenu,
  dummyGrocery,
} from "../data/dummydata";

const router = Router();


router.get("/", (req: Request, res: Response) => {
  res.json(dummyproducts);
});


router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const product = dummyproducts.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

router.get("/category/:category", (req: Request, res: Response) => {
  const category = req.params.category as string;

  const products = dummyproducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  res.json(products);
});



router.get("/menu/all", (req: Request, res: Response) => {
  res.json(dummyMenu);
});


router.get("/grocery/all", (req: Request, res: Response) => {
  res.json(dummyGrocery);
});

export default router;
