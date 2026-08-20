function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("luxeCart")) || [];
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);

  document.querySelectorAll(".cart-count").forEach((badge) => {
    badge.textContent = itemCount;
  });
}

updateCartBadge();
