import mongoose, { Schema, Document } from 'mongoose';

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['menu', 'grocery', 'shopping'] // Inhi 3 mein se ek hoga
  },
  description: { type: String },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);