import mongoose, { Schema, Document } from 'mongoose';

interface IOrderProduct {
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  products: IOrderProduct[];
  name: string;
  surname: string;
  phone: string;
  state: string;
  confirmed: boolean;
}

const orderSchema: Schema = new Schema(
  {
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
