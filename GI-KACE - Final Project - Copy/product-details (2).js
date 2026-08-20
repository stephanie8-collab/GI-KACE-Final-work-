const productId = new URLSearchParams(window.location.search).get("id");
const product = getProductById(productId);

if (!product) {
  window.location.href = "Product-All-Product.html";
} else {
  document.getElementById("pdp-title").textContent = product.name;
  document.getElementById("pdp-price").textContent = `₵${product.price.toFixed(2)}`;
  document.getElementById("pdp-desc").textContent = product.description;
  document.getElementById("pdp-current").textContent = product.name;
  document.title = `${product.name} - LUXE`;

  document.querySelectorAll(".pdp-gallery-image").forEach((image) => {
    image.src = product.image;
    image.alt = product.name;
  });

  document.getElementById("add-to-bag-btn").addEventListener("click", () => {
    addToCart(product);
    alert(`${product.name} was added to your bag.`);
  });
}
