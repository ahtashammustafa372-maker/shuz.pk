import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String, required: true },
  reason: { type: String, required: true },
  details: { type: String, default: '' },
  status: { type: String, default: 'Pending' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Return = mongoose.models.Return || mongoose.model('Return', ReturnSchema);
export default Return;
