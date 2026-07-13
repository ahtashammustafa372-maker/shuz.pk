import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  status: { type: String, default: 'published' },
  author: { type: String, default: 'Admin' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);
export default Page;
