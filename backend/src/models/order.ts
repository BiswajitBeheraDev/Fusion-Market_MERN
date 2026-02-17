import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, default: null },
  total: { type: Number, required: true },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  status: { type: String, default: "pending" },
  paymentMethod: { type: String },
  orderType: { type: String },
  customer: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
  }
}, { timestamps: true }); 

export default mongoose.model('Order', OrderSchema);