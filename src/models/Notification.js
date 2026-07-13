import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // order, return, system, info
  link: { type: String, default: '' },
  read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export default Notification;
