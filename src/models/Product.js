import mongoose from 'mongoose';

const SeoSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  keywords: { type: String, default: '' },
  tags: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  ogImage: { type: String, default: '' }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  compare_at_price: { type: Number, default: null },
  category_slug: { type: String, required: true },
  images: [{ type: String }],
  colors: [{ type: String }],
  sizes: [{ type: mongoose.Schema.Types.Mixed }], // can be strings or numbers
  sizeStock: { type: Map, of: Number, default: {} },
  stock: { type: Number, default: 0 },
  vendor: { type: String, default: 'Generic' },
  featured: { type: Boolean, default: false },
  new_arrival: { type: Boolean, default: false },
  flash_sale: { type: Boolean, default: false },
  seo: { type: SeoSchema, default: () => ({}) }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Prevent model overwrite upon hot reloads in Next.js
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
