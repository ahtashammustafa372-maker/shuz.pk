import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // e.g., 'general', 'homepage', 'theme', 'slider'
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export default Setting;
