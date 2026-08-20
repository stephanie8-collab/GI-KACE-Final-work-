function getCart() {
  return JSON.parse(localStorage.getItem("luxeCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("luxeCart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      variant: product.variant,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
}
