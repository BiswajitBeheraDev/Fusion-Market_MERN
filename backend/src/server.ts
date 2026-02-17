import app from "./app";
import connectDB from "./config/db";
import Product from "./models/product"; 
import { dummyGrocery, dummyMenu, dummyproducts } from "./data/dummydata";

const PORT = process.env.PORT || 5000;

const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log("🌱 Database khali hai. Data upload ho raha hai...");

      const foodItems = dummyMenu.map(({ id, ...rest }: any) => ({ 
        ...rest, 
        category: 'food' 
      }));

      const groceryItems = dummyGrocery.map(({ id, ...rest }: any) => ({ 
        ...rest, 
        category: 'grocery' 
      }));

      const shoppingItems = dummyproducts.map(({ id, ...rest }: any) => ({ 
        ...rest, 
        category: rest.category || 'shopping' 
      }));

      const allData = [...foodItems, ...groceryItems, ...shoppingItems];
      await Product.insertMany(allData);
      
      console.log(`✅ Success! ${allData.length} items MongoDB mein dikhne chahiye.`);
    } else {
      console.log(`ℹ️ DB mein pehle se ${count} items hain. Seeding skip kar di.`);
    }
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
};

connectDB().then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
});