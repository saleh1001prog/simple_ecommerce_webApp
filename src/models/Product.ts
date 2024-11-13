import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number; // Add quantity field here
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }], // Array of image URLs
  quantity: { type: Number, required: true, default: 0 }, // Define quantity field with a default value
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
