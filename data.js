// js/data.js
const PRODUCTS = [
  {
    id: 1,
    name: "Structured Linen Blazer",
    variant: "Midnight Black",
    price: 285.0,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    badge: "",
    description: "A lightweight, tailored linen blazer cut for effortless layering and refined silhouette."
  },
  {
    id: 2,
    name: "Essential Court Sneaker",
    variant: "Optic White",
    price: 195.0,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    badge: "New",
    description: "A minimal, everyday sneaker crafted from premium leather with a supportive cupsole."
  },
  {  
    id: 3,
    name: "Monochrome Horizon Watch",
    variant: "Silver / Matte Black",
    price: 420.0,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    badge: "",
    description: "A refined timepiece with a sleek dial and interchangeable straps for versatile wear."
  },
  {
    id: 4,
    name: "Raw Silk Wrap",
    variant: "Ecru",
    price: 115.0,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    badge: "",
    description: "Sumptuously soft silk wrap finished with hand-rolled hems for understated luxury."
  },
  {
    id: 5,
    name: "Hand-Thrown Ceramic Vessel",
    variant: "Sandstone",
    price: 75.0,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80",
    badge: "",
    description: "A small, tactile ceramic piece glazed by hand — perfect as a decorative object."
  },
  {
    id: 6,
    name: "Selvedge Denim Trucker",
    variant: "Raw Indigo",
    price: 210.0,
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600&q=80",
    badge: "",
    description: "A heritage-inspired trucker jacket made from rigid selvedge denim with classic stitching."
  }
];

function seedProducts() {
  if (!localStorage.getItem('luxeProducts')) {
    localStorage.setItem('luxeProducts', JSON.stringify(PRODUCTS));
  }
}

function getProducts() {
  seedProducts();
  const raw = localStorage.getItem('luxeProducts');
  try {
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

function getProductById(id) {
  const num = Number(id);
  return getProducts().find(p => p.id === num);
}

window.PRODUCTS = PRODUCTS;
window.seedProducts = seedProducts;
window.getProducts = getProducts;
window.getProductById = getProductById;

// Seed on load so other scripts can rely on data immediately
seedProducts();


