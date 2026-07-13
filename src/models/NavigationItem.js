import mongoose from 'mongoose';

const SubItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const NavigationItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  subItems: [SubItemSchema]
}, { timestamps: true });

const NavigationItem = mongoose.models.NavigationItem || mongoose.model('NavigationItem', NavigationItemSchema);
export default NavigationItem;
