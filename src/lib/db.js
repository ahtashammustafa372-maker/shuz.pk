const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'db.json');

// Helper to load DB
function loadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = getSeedData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { products: [], collections: [], orders: [], returns: [], pages: [], notifications: [], settings: { slider: [] } };
  }
}

// Helper to save DB
function saveDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error saving database:", err);
    return false;
  }
}

// Seed Data
function getSeedData() {
  const collections = [
    { name: "Sneakers", slug: "sneakers", image: "/images/sneaker_black.jpg" },
    { name: "Basketball", slug: "basketball", image: "/images/sneaker_white.jpg" },
    { name: "7A Premium", slug: "7a-premium", image: "/images/sneaker_black.jpg" },
    { name: "Slides & Flip Flops", slug: "flip-flops", image: "/images/slide_black.jpg" },
    { name: "Runners", slug: "runners", image: "/images/runner_red.jpg" },
    { name: "Spezial", slug: "spezial", image: "/images/sneaker_white.jpg" },
    { name: "T-Shirts", slug: "t-shirts", image: "/images/tshirt_black.jpg" },
    { name: "Men", slug: "men", image: "/images/sneaker_black.jpg" },
    { name: "Major Loafers", slug: "major-loafers", image: "/images/slide_black.jpg" }
  ];

  const baseProducts = [
    // Sneakers / AJ-IV / 7A Premium
    {
      title: "PRIME X3 STRUNG - TRIPLE BLACK",
      slug: "prime-x3-strung-triple-black",
      description: "Experience ultimate cushioning and style with the Prime X3 Strung in stealth Triple Black. Featuring an innovative multi-layered carbon plate and premium knit upper, this sneaker offers responsive energy return and a sleek futuristic profile.",
      price: 18500,
      compare_at_price: 24000,
      category_slug: "sneakers",
      images: ["/images/sneaker_black.jpg"],
      colors: ["Black"],
      sizes: [40, 41, 42, 43, 44, 45],
      stock: 12,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "PRIME X3 STRUNG - BLACK DUO",
      slug: "prime-x3-strung-black-duo",
      description: "The Prime X3 Strung Black Duo combines contrasting black and dark grey tones. Built for both high-impact running and street style, this premium replica captures every detail of the original design.",
      price: 18500,
      compare_at_price: 24000,
      category_slug: "sneakers",
      images: ["/images/sneaker_black.jpg"],
      colors: ["Black", "Grey"],
      sizes: [39, 40, 41, 42, 43, 44],
      stock: 8,
      featured: true,
      new_arrival: false,
      flash_sale: true,
      vendor: "Adidas"
    },
    {
      title: "PRIME X3 STRUNG - LUCID RED",
      slug: "prime-x3-strung-lucid-red",
      description: "Turn heads with the vibrant Prime X3 Strung in Lucid Red. Combining premium mesh, carbon-fiber rod replicas, and dynamic foam cushioning, this shoe is a statement of speed and fashion.",
      price: 18500,
      compare_at_price: 24000,
      category_slug: "runners",
      images: ["/images/runner_red.jpg"],
      colors: ["Red", "White"],
      sizes: [40, 41, 42, 43, 44],
      stock: 5,
      featured: false,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "PRIME X3 STRUNG - AMG BLACK",
      slug: "prime-x3-strung-amg-black",
      description: "A special edition collaboration theme, featuring AMG signature design lines in a high-performance running shape. Durable outsole, highly detailed details.",
      price: 19000,
      compare_at_price: 26000,
      category_slug: "sneakers",
      images: ["/images/sneaker_black.jpg"],
      colors: ["Black", "Silver"],
      sizes: [41, 42, 43, 44, 45],
      stock: 6,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "UB LIGHT 23 - ARCTIC NIGHT",
      slug: "ub-light-23-arctic-night",
      description: "Super light cushioning, premium knit upper, in an exclusive Arctic Night deep navy/blue colorway. Ideal for long walks and daily comfort.",
      price: 12500,
      compare_at_price: 16000,
      category_slug: "runners",
      images: ["/images/runner_red.jpg"],
      colors: ["Blue", "Navy"],
      sizes: [39, 40, 41, 42, 43, 44],
      stock: 15,
      featured: false,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "UB LIGHT 23 - TRIPLE WHITE",
      slug: "ub-light-23-triple-white",
      description: "Clean, elegant, and timeless. The UB Light 23 in Triple White is the ultimate summer lifestyle sneaker, offering premium breathability.",
      price: 12500,
      compare_at_price: 16000,
      category_slug: "sneakers",
      images: ["/images/sneaker_white.jpg"],
      colors: ["White"],
      sizes: [40, 41, 42, 43, 44, 45],
      stock: 20,
      featured: true,
      new_arrival: false,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "UB LIGHT 23 - BLACK DUO ( D.F BATCH )",
      slug: "ub-light-23-black-duo-df-batch",
      description: "Highest tier 7A batch (D.F Batch) of the UB Light 23. Precision stitching, original materials replica, and supreme comfort.",
      price: 13000,
      compare_at_price: 18000,
      category_slug: "7a-premium",
      images: ["/images/sneaker_black.jpg"],
      colors: ["Black", "Grey"],
      sizes: [40, 41, 42, 43, 44],
      stock: 7,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "AIRFORCE 1 MIDS - MOCHA",
      slug: "airforce-1-mids-mocha",
      description: "The classic Air Force 1 Mid cut in the popular earthy Mocha color scheme. Structured leather panels, padded ankle strap, and durable sole.",
      price: 14500,
      compare_at_price: 19000,
      category_slug: "sneakers",
      images: ["/images/sneaker_white.jpg"],
      colors: ["Brown", "White"],
      sizes: [39, 40, 41, 42, 43, 44],
      stock: 9,
      featured: true,
      new_arrival: false,
      flash_sale: true,
      vendor: "Nike"
    },
    {
      title: "NB 9060 - CASTLE ROCK GREY",
      slug: "nb-9060-castle-rock-grey",
      description: "Retro-futuristic style featuring a chunky mesh and suede upper in Castle Rock Grey. High-quality details with signature comfort tech recreation.",
      price: 16500,
      compare_at_price: 22000,
      category_slug: "sneakers",
      images: ["/images/sneaker_black.jpg"],
      colors: ["Grey"],
      sizes: [40, 41, 42, 43, 44, 45],
      stock: 11,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "New Balance"
    },
    {
      title: "H IZMIR SLIDE - BLACK CAMO",
      slug: "h-izmir-slide-black-camo",
      description: "Premium designer leather slides with the iconic H cutout, finished in an elegant black camo texture. Sleek, comfortable, and perfect for warm weather.",
      price: 9500,
      compare_at_price: 15000,
      category_slug: "flip-flops",
      images: ["/images/slide_black.jpg"],
      colors: ["Black"],
      sizes: [39, 40, 41, 42, 43, 44, 45],
      stock: 14,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "Hermes"
    },
    {
      title: "H IZMIR SLIDE - TAN (EMBOSSED)",
      slug: "h-izmir-slide-tan-embossed",
      description: "Timeless luxury Tan color embossed leather slide. Crafted with soft leather footbed lining and durable grip outsoles.",
      price: 10000,
      compare_at_price: 16000,
      category_slug: "flip-flops",
      images: ["/images/slide_black.jpg"],
      colors: ["Tan", "Brown"],
      sizes: [40, 41, 42, 43, 44],
      stock: 10,
      featured: false,
      new_arrival: false,
      flash_sale: true,
      vendor: "Hermes"
    },
    {
      title: "SPEZIAL - LIGHT BLUE",
      slug: "spezial-light-blue",
      description: "Terrace fashion icon Spezial in vintage Light Blue suede with white stripes. Low profile, gum rubber outsole, classic comfort.",
      price: 11500,
      compare_at_price: 15000,
      category_slug: "spezial",
      images: ["/images/sneaker_white.jpg"],
      colors: ["Blue", "White"],
      sizes: [39, 40, 41, 42, 43, 44],
      stock: 16,
      featured: true,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "SAMBA - PINK",
      slug: "samba-pink",
      description: "A trendy pink colorway of the iconic Samba leather sneaker. Sleek indoor soccer aesthetic made for modern everyday outfits.",
      price: 12000,
      compare_at_price: 16000,
      category_slug: "spezial",
      images: ["/images/sneaker_white.jpg"],
      colors: ["Pink"],
      sizes: [36, 37, 38, 39, 40, 41],
      stock: 8,
      featured: false,
      new_arrival: true,
      flash_sale: false,
      vendor: "Adidas"
    },
    {
      title: "Phillip T-shirt - Black (JU 159)",
      slug: "plp-t-shirt-black-ju-159",
      description: "Premium heavy-cotton casual t-shirt with signature minimal graphics on front. Regular fit, breathable fabric.",
      price: 3500,
      compare_at_price: 5000,
      category_slug: "t-shirts",
      images: ["/images/tshirt_black.jpg"],
      colors: ["Black"],
      sizes: [38, 40, 42, 44], // S, M, L, XL sizes represented as chest inches
      stock: 25,
      featured: false,
      new_arrival: true,
      flash_sale: false,
      vendor: "Philipp Plein"
    }
  ];

  // Auto-generate IDs
  const products = baseProducts.map((p, idx) => ({
    id: idx + 1,
    ...p,
    created_at: new Date().toISOString()
  }));

  // Slider Settings
  const settings = {
    slider: [
      { id: 1, image: "/images/slider1.jpg", link: "/collections/sneakers" },
      { id: 2, image: "/images/slider2.jpg", link: "/collections/7a-premium" },
      { id: 3, image: "/images/slider3.jpg", link: "/collections/runners" }
    ],
    announcement: "Free Shipping on all orders over Rs. 5000!",
    storeInfo: {
      address: "123 Sneaker Street, Lahore",
      phone: "+92 300 1234567",
      email: "info@shuz.pk",
      hours: "Mon-Sat: 10AM - 10PM"
    },
    socialLinks: {
      facebook: "https://facebook.com/shuz",
      instagram: "https://instagram.com/shuz"
    },
    seo: {
      title: "Shop Best Sneakers & Premium Shoes - Shuz.pk",
      description: "Bringing the best sneakers, runners and 7A premium shoes to Pakistan.",
      keywords: "sneakers, shoes, pakistan",
      ogImage: "/images/logo.png"
    },
    headerMenus: [
      { label: "Home", url: "/" },
      { label: "Shop All", url: "/collections/all" }
    ],
    footer: {
      description: "Bringing the best of global sneaker culture to pakistan by selling Premium Shoes at fraction of the price of their brand-new counterparts",
      newsletterTitle: "Let's get in touch",
      newsletterDesc: "Sign up for our newsletter for updates and offers.",
      copyrightText: "© Shuz 2026 - All Rights Reserved",
      developerText: 'Developed By <span class="ozbix-text">Ozbix</span>',
      menus: {
        quickLinks: [
          { label: "Men", url: "/collections/men" },
          { label: "Major Loafers", url: "/collections/major-loafers" },
          { label: "New Arrival", url: "/collections/new-arrival" },
          { label: "Flash Sale", url: "/collections/flash-sale" },
          { label: "More", url: "/collections/more" }
        ],
        information: [
          { label: "FAQs", url: "/pages/faqs" },
          { label: "Contact us", url: "/pages/contact-us" },
          { label: "Privacy Policy", url: "/policies/privacy-policy" },
          { label: "Terms & Conditions", url: "/policies/terms-conditions" },
          { label: "Shipment & Return Policy", url: "/policies/shipment-return-policy" },
          { label: "Blogs", url: "/blogs/news" }
        ]
      }
    }
  };

  const pages = [
    {
      id: 1,
      title: "FAQs",
      slug: "faqs",
      type: "page",
      content: "<h2>Frequently Asked Questions</h2><p>Here are some of our most commonly asked questions.</p>",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Contact Us",
      slug: "contact-us",
      type: "page",
      content: "<h2>Contact Us</h2><p>Email us at info@shuz.pkm or call us at +92-XXX-XXXXXXX.</p>",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Privacy Policy",
      slug: "privacy-policy",
      type: "policy",
      content: "<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Terms & Conditions",
      slug: "terms-conditions",
      type: "policy",
      content: "<h2>Terms & Conditions</h2><p>Please read our terms and conditions carefully.</p>",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      title: "Shipment & Return Policy",
      slug: "shipment-return-policy",
      type: "policy",
      content: "<h2>Shipment & Return Policy</h2><p>We offer nationwide delivery and a 7-day return policy.</p>",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      title: "Latest News",
      slug: "news",
      type: "blog",
      content: "<h2>Our Latest Sneakers Drop</h2><p>Check out our latest arrivals and premium replicas.</p>",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const returns = [
    {
      id: 1,
      order_id: 101,
      customer_name: "Ali Khan",
      customer_email: "ali@example.com",
      product_name: "PRIME X3 STRUNG - TRIPLE BLACK",
      reason: "Size is too small",
      status: "Pending",
      created_at: new Date().toISOString()
    }
  ];

  return { products, collections, orders: [], returns, pages, settings };
}

// Database Methods API
const db = {
  // Products
  getProducts: () => {
    return loadDb().products;
  },
  
  getProductBySlug: (slug) => {
    return loadDb().products.find(p => p.slug === slug) || null;
  },

  getProductById: (id) => {
    return loadDb().products.find(p => p.id === parseInt(id)) || null;
  },
  
  getProductsByCollection: (collectionSlug) => {
    const data = loadDb();
    if (collectionSlug === 'all') return data.products;
    return data.products.filter(p => p.category_slug === collectionSlug);
  },

  createProduct: (product) => {
    const data = loadDb();
    const newId = data.products.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
    const newProduct = {
      id: newId,
      ...product,
      slug: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      created_at: new Date().toISOString()
    };
    data.products.push(newProduct);
    saveDb(data);
    return newProduct;
  },

  updateProduct: (id, updatedFields) => {
    const data = loadDb();
    const idx = data.products.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    
    data.products[idx] = {
      ...data.products[idx],
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
    saveDb(data);
    return data.products[idx];
  },

  deleteProduct: (id) => {
    const data = loadDb();
    const idx = data.products.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return false;
    data.products.splice(idx, 1);
    saveDb(data);
    return true;
  },

  // Collections
  getCollections: () => {
    return loadDb().collections;
  },

  // Orders
  getOrders: () => {
    return loadDb().orders;
  },

  getOrderById: (id) => {
    return loadDb().orders.find(o => o.id === parseInt(id)) || null;
  },

  createOrder: (orderData) => {
    const data = loadDb();
    const newId = data.orders.reduce((max, o) => o.id > max ? o.id : max, 0) + 1;
    const newOrder = {
      id: newId,
      ...orderData,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    
    // Decrement stock for ordered items
    orderData.items.forEach(item => {
      const productIdx = data.products.findIndex(p => p.id === item.id);
      if (productIdx !== -1) {
        data.products[productIdx].stock = Math.max(0, data.products[productIdx].stock - item.quantity);
      }
    });

    data.orders.push(newOrder);
    saveDb(data);
    return newOrder;
  },

  updateOrderStatus: (id, status) => {
    const data = loadDb();
    const idx = data.orders.findIndex(o => o.id === parseInt(id));
    if (idx === -1) return null;
    data.orders[idx].status = status;
    saveDb(data);
    return data.orders[idx];
  },

  // Returns
  getReturns: () => {
    const data = loadDb();
    return data.returns || [];
  },

  getReturnById: (id) => {
    const data = loadDb();
    return (data.returns || []).find(r => r.id === parseInt(id)) || null;
  },

  createReturn: (returnData) => {
    const data = loadDb();
    if (!data.returns) data.returns = [];
    const newId = data.returns.reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    const newReturn = {
      id: newId,
      ...returnData,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    data.returns.push(newReturn);
    saveDb(data);
    return newReturn;
  },

  updateReturnStatus: (id, status) => {
    const data = loadDb();
    if (!data.returns) data.returns = [];
    const idx = data.returns.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return null;
    data.returns[idx].status = status;
    saveDb(data);
    return data.returns[idx];
  },

  // Settings
  getSettings: () => {
    return loadDb().settings || { slider: [] };
  },

  updateSliderSettings: (sliderData) => {
    const data = loadDb();
    if (!data.settings) data.settings = {};
    data.settings.slider = sliderData;
    saveDb(data);
    return data.settings.slider;
  },

  // Pages
  getPages: () => {
    return loadDb().pages || [];
  },

  getPageBySlug: (slug) => {
    return (loadDb().pages || []).find(p => p.slug === slug) || null;
  },

  createPage: (pageData) => {
    const data = loadDb();
    if (!data.pages) data.pages = [];
    const newId = data.pages.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
    const newPage = {
      id: newId,
      ...pageData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.pages.push(newPage);
    saveDb(data);
    return newPage;
  },

  updatePage: (id, updatedFields) => {
    const data = loadDb();
    if (!data.pages) data.pages = [];
    const idx = data.pages.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return null;
    
    data.pages[idx] = {
      ...data.pages[idx],
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
    saveDb(data);
    return data.pages[idx];
  },

  deletePage: (id) => {
    const data = loadDb();
    if (!data.pages) data.pages = [];
    const idx = data.pages.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return false;
    data.pages.splice(idx, 1);
    saveDb(data);
    return true;
  },

  // Notifications
  getNotifications: () => {
    const data = loadDb();
    return data.notifications || [];
  },

  addNotification: (title, message, type = 'info', link = null) => {
    const data = loadDb();
    if (!data.notifications) data.notifications = [];
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      link,
      read: false,
      created_at: new Date().toISOString()
    };
    data.notifications.unshift(newNotification); // Add to beginning
    // Keep only last 100 notifications
    if (data.notifications.length > 100) {
      data.notifications = data.notifications.slice(0, 100);
    }
    saveDb(data);
    return newNotification;
  },

  markAllNotificationsRead: () => {
    const data = loadDb();
    if (!data.notifications) return true;
    let modified = false;
    data.notifications.forEach(n => {
      if (!n.read) {
        n.read = true;
        modified = true;
      }
    });
    if (modified) {
      saveDb(data);
    }
    return true;
  }
};

module.exports = db;
