import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  size: { type: mongoose.Schema.Types.Mixed },
  color: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // unique string order ID like '#1001'
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  total: { type: Number, required: true },
  items: [OrderItemSchema],
  status: { type: String, default: 'Pending' },
  payment_method: { type: String, default: 'COD' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
