const itemsContainer = document.getElementById("items");
const taxRate = 0.08;

function fmt(number) {
  return `₵${number.toFixed(2)}`;
}

function renderItemCard(item) {
  return `
    <article class="item-card" data-id="${item.id}">
      <div class="item-img"><img src="${item.image}" alt="${item.name}"></div>
      <div class="item-mid">
        <div class="item-top-row">
          <div>
            <p class="item-name">${item.name}</p>
            <p class="item-meta">${item.variant}</p>
          </div>
          <button class="remove-btn" aria-label="Remove ${item.name}">&times;</button>
        </div>
        <div class="qty-stepper">
          <button class="qty-minus" aria-label="Decrease quantity">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-plus" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="item-price">${fmt(item.price * item.qty)}</div>
    </article>`;
}

function recalcSummary(cart) {
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const tax = subtotal * taxRate;

  document.getElementById("subtotal-label").textContent = `Subtotal (${itemCount} items)`;
  document.getElementById("subtotal-val").textContent = fmt(subtotal);
  document.getElementById("tax-val").textContent = fmt(tax);
  document.getElementById("total-val").textContent = fmt(subtotal + tax);
  document.getElementById("item-count-text").textContent = `You have ${itemCount} items in your luxury curation.`;
}

function renderBag() {
  const cart = getCart();
  itemsContainer.innerHTML = cart.map(renderItemCard).join("");
  recalcSummary(cart);
}

itemsContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".item-card");
  if (!card) {
    return;
  }

  const itemId = Number(card.dataset.id);
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === itemId);
  if (!item) {
    return;
  }

  if (event.target.closest(".qty-plus")) {
    item.qty += 1;
  } else if (event.target.closest(".qty-minus")) {
    if (item.qty > 1) {
      item.qty -= 1;
    }
  } else if (event.target.closest(".remove-btn")) {
    cart.splice(cart.findIndex((cartItem) => cartItem.id === itemId), 1);
  } else {
    return;
  }

  saveCart(cart);
  updateCartBadge();
  renderBag();
});

renderBag();
