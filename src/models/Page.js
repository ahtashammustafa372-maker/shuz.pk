import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  status: { type: String, default: 'published' },
  author: { type: String, default: 'Admin' },
  type: { type: String, enum: ['page', 'policy', 'blog'], default: 'page' },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' }
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);
export default Page;
