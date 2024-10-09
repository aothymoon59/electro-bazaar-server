import { Schema, model } from 'mongoose';
import { ICart } from './cart.interface';

const ProductSchema = new Schema<ICart>(
  {
    product_id: { type: String },
    email: { type: String },
    product_name: { type: String },
    product_image: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true },
);

const Cart = model<ICart>('Cart', ProductSchema);
export default Cart;
