const productGrid = document.getElementById("product-grid");
const products = getProducts();

function renderProductCard(product) {
  const badge = product.badge ? `<span class="badge">${product.badge}</span>` : "";
  return `
    <article class="card" data-id="${product.id}">
      <div class="card-img">
        ${badge}
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="card-info">
        <div>
          <p class="card-name">${product.name}</p>
          <p class="card-variant">${product.variant}</p>
        </div>
        <div class="card-price">₵${product.price.toFixed(2)}</div>
      </div>
    </article>`;
}

function renderAllProducts(list) {
  productGrid.innerHTML = list.map(renderProductCard).join("");
}

productGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) {
    return;
  }
  window.location.href = `Product-Details.html?id=${card.dataset.id}`;
});

renderAllProducts(products);
