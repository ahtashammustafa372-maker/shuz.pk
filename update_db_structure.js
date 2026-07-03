const fs = require('fs');

const path = './src/lib/db.json';
const db = JSON.parse(fs.readFileSync(path, 'utf8'));

if (!db.users) {
  db.users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@jutay.co",
      password: "admin", // simple text password for prototype
      role: "admin",
      created_at: new Date().toISOString()
    }
  ];
}

if (!db.navbar) {
  db.navbar = [
    { id: 1, label: "Men", link: "/collections/men", order: 1 },
    { id: 2, label: "Women", link: "/collections/women", order: 2 },
    { id: 3, label: "New Arrival", link: "/collections/new-arrival", order: 3 },
    { id: 4, label: "Major Loafers", link: "/collections/major-loafers", order: 4 },
    { id: 5, label: "On Cloud", link: "/collections/on-cloud-men", order: 5 },
    { id: 6, label: "Runners", link: "/collections/runners", order: 6 },
    { id: 7, label: "Air Jordan", link: "/collections/aj-iv", order: 7 },
    { id: 8, label: "T-Shirts", link: "/collections/t-shirts", order: 8 },
    { id: 9, label: "Flash Sale", link: "/collections/12-12-sale", order: 9 }
  ];
}

if (!db.settings) {
  db.settings = {};
}
if (!db.settings.theme) {
  db.settings.theme = {
    primaryColor: "#c10000",
    secondaryColor: "#111111",
    fontSizeBase: "14px"
  };
}
if (!db.settings.general) {
  db.settings.general = {
    storeName: "Jutay.co",
    shippingPolicy: "Free Shipping all Over Pakistan. Orders over 20,000 need a 10% advance."
  };
}

// Preserve slider if exists
if (!db.settings.slider) {
  db.settings.slider = [];
}

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log("Database updated successfully.");
