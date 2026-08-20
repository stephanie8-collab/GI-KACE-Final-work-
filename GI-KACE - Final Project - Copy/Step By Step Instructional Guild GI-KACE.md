# Making LUXE Dynamic — Step-by-Step Instructions GI-KACE

Follow each step, then write the code
yourself before moving to the next one. Test after every step — don't
write three files and then debug all of them at once.

## 0. The plan

You'll create one new folder, `js/`, and build these files one at a time:

```
luxe/
  Log-In.html                Log-In.css
  Sign-Up.html                Sign-Up.css
  Product-All-Product.html         Product-All-Product.css
  Product-Details.html              Product-Details.css
  Shopping-Bag.html                    Shopping-Bag.css
  js/
    data.js          <- Step 1
    signup.js         <- Step 2
    login.js            <- Step 3
    cart-badge.js         <- Step 4
    products.js              <- Step 5 & 6
    product-details.js           <- Step 7
    cart.js                          <- Step 8
    bag.js                              <- Step 9
```

You'll use four `localStorage` "tables" — each one just a JavaScript
array or object saved as text:

| Key                | What it stores                          |
|--------------------|-----------------------------------------|
| `luxeProducts`     | The list of all products (seeded once)  |
| `luxeUsers`        | Everyone who has signed up              |
| `luxeCurrentUser`  | Whoever is currently logged in          |
| `luxeCart`         | The items currently in the shopping bag |

`localStorage` only stores text, so every save uses `JSON.stringify()`
and every read uses `JSON.parse()`. You'll use that pair constantly —
get comfortable with it before you start.

---

## Step 1 — Build the product "database" (`js/data.js`)

**Goal:** one file that every other page can pull the product list from.

1. In `js/data.js`, declare a constant array of six product objects. Give
   each one: `id` (a plain number, 1 through 6), `name`, `variant`,
   `price` (a number, not a string), `image` (a URL string), `badge`
   (empty string `""` for most, `"New"` for the sneaker), and
   `description` (a sentence or two for the details page later).

2. Write a function `seedProducts()` that:
   - Checks whether `localStorage` already has a key called
     `luxeProducts`, using `localStorage.getItem()`.
   - If it does **not** exist yet, saves your array into
     `localStorage` under that key — remembering to convert the array
     to text with `JSON.stringify()` first.
   - This function should do nothing if the data is already there, so
     it's safe to call on every single page load without duplicating
     data.

3. Write a function `getProducts()` that:
   - Calls `seedProducts()` first (so it's guaranteed to exist).
   - Reads `luxeProducts` back out of `localStorage`.
   - Converts it from text back into a real array with `JSON.parse()`.
   - Returns that array.

4. Write a function `getProductById(id)` that:
   - Calls `getProducts()` to get the full list.
   - Uses the array's `.find()` method to return the one product whose
     `id` matches the `id` you were given.
   - **Careful:** an id coming from a URL will be text (`"3"`), but your
     product `id`s are numbers (`3`). Convert the incoming id with
     `Number()` before comparing, or the match will silently fail.

5. Add `<script src="js/data.js"></script>` as the **first** script tag
   on every one of your five HTML pages, before any other script.

**Test it:** open any page, open DevTools → Console, and type
`getProducts()`. You should see your six-item array printed out. Then
check DevTools → Application → Local Storage to confirm `luxeProducts`
is sitting there as a JSON string.

---

## Step 2 — Sign Up page (`Sign-Up.html` + `js/signup.js`)

### 2.1 Prepare the HTML first

1. Give the `<form>` an `id`, e.g. `id="signup-form"`.
2. Give each input an `id`: something like `fullname`, `email`,
   `password`, `confirm-password`.
3. Change the submit button to `type="submit"` if it isn't already.
4. Add an empty element for showing error messages, e.g.
   `<p id="signup-error"></p>`, hidden by default (`display: none` in
   CSS or inline style).
5. Link `js/data.js` then `js/signup.js` at the bottom of the page.

### 2.2 Build the logic

1. Select the form element and add a `"submit"` event listener to it.
2. Inside the listener, call `event.preventDefault()` immediately — this
   is the single most important line, because without it the browser
   will reload the page and wipe out your script before it finishes.
3. Read the current value out of each input field (`fullname`, `email`,
   `password`, `confirm-password`). Trim whitespace off the email, and
   consider lower-casing it so `Ex@Email.com` and `ex@email.com` aren't
   treated as different accounts.
4. Compare `password` and `confirm-password`. If they don't match, put
   a message into your error element, make it visible, and `return`
   early so nothing else in the function runs.
5. Read the existing users list: get `luxeUsers` from `localStorage`,
   parse it, and — since it might not exist yet on someone's very first
   signup — fall back to an empty array if the result is `null`.
6. Use `.some()` to check whether any existing user already has this
   email. If so, show an error and `return`.
7. If everything checks out, build a plain object with `fullname`,
   `email`, and `password`, and push it onto the users array.
8. Save the whole updated array back into `localStorage` under
   `luxeUsers`, converting it to text with `JSON.stringify()`.
9. Also save a separate `luxeCurrentUser` entry (just `fullname` and
   `email` — no need to keep the password around in this key) so the
   person is considered "logged in" immediately after signing up.
10. Finish by redirecting them with
    `window.location.href = "Product-All-Product.html"`.

**Test it:** submit the form, then check DevTools → Application → Local
Storage for both `luxeUsers` and `luxeCurrentUser`. Try signing up with
the same email twice — you should see your error message instead of a
duplicate entry.

---

## Step 3 — Login page (`Log-In.html` + `js/login.js`)

Your inputs already have `id="email"` and `id="password"`, so you mostly
need to work on the logic.

1. Give the `<form>` an `id`, e.g. `id="login-form"`, and add an empty
   error element like you did on Sign Up.
2. Link `js/data.js` then `js/login.js` at the bottom of the page.
3. Add a `"submit"` listener to the form, call `event.preventDefault()`
   first, same as before.
4. Read the `email` and `password` field values.
5. Read `luxeUsers` from `localStorage` (fall back to an empty array if
   it doesn't exist).
6. Use `.find()` to look for a user object whose `email` **and**
   `password` both match what was typed.
7. If nothing matches, show an error message and `return`.
8. If a match is found, save a `luxeCurrentUser` entry with that user's
   `fullname` and `email` (again, leave the password out of this one).
9. Redirect to `Product-All-Product.html`.

**Test it:** log in with an account you created in Step 2. Try a wrong
password too, and confirm you get the error message instead of being
let through.

---

## Step 4 — Keep the cart badge in sync everywhere (`js/cart-badge.js`)

This one small file is reused on every page, so build it once here.

1. Write a function `updateCartBadge()` that:
   - Reads `luxeCart` from `localStorage` (fall back to an empty array
     if it's `null`, since nobody has added anything yet).
   - Adds up the `qty` of every item in that array — `.reduce()` is a
     good fit here — to get a single total item count.
   - Selects **every** element with the class `cart-count` on the page
     (there may be more than one instance in some layouts), using
     `document.querySelectorAll()`.
   - Loops through them and sets each one's text content to the total
     item count.
2. Call `updateCartBadge()` once immediately, at the bottom of the file,
   so it runs as soon as the script loads.
3. On **every** page (Products, Details, Bag — Sign Up and Login don't
   have a populated cart yet, but it doesn't hurt to include it there
   too), add `<script src="js/cart-badge.js"></script>` right after
   `data.js`.

**Test it:** in DevTools console, manually set a fake cart —
`localStorage.setItem("luxeCart", JSON.stringify([{id:1, qty:2}]))` —
then refresh a page and confirm the header bubble shows `2`.

---

## Step 5 — Render the All Products page from data

### 5.1 Restructure the HTML first

1. In `Product-All-Product.html`, find the `<div class="grid">` and give
   it an `id`, e.g. `id="product-grid"`.
2. Move the `<div class="pagination">` block so it sits **outside** and
   **after** the grid div, not nested inside it — you're about to
   replace everything inside the grid with JavaScript-generated content,
   and you don't want to wipe out the pagination controls every time you
   do that.
3. Delete all six hardcoded `<article class="card">` blocks. JavaScript
   will build these from now on.
4. Link `js/data.js`, then `js/cart-badge.js`, then `js/products.js`.

### 5.2 Build the rendering logic

1. Select your `#product-grid` element and store it in a variable.
2. Call `getProducts()` from `data.js` to get the array.
3. Write a function `renderProductCard(product)` that takes one product
   object and returns an HTML string for a single `<article
   class="card">`, matching the exact markup structure your CSS already
   expects (image wrapper, name, variant, price). A few details to get
   right:
   - Set `data-id="${product.id}"` on the `<article>` itself — you'll
     need this in the next step to know which card was clicked.
   - Only include the `<span class="badge">` element when
     `product.badge` is not empty — an easy way is a ternary or an `if`
     that builds an empty string otherwise.
   - Format the price with two decimal places (e.g. using
     `.toFixed(2)`) and prefix it with `₵`.
4. Write a function `renderAllProducts(list)` that maps every product in
   the list through `renderProductCard`, joins the resulting array of
   strings into one big string, and sets it as the `innerHTML` of your
   grid element.
5. Call `renderAllProducts(products)` once, at the bottom of the file.

**Test it:** reload the products page. It should look identical to
before, but now the six cards exist only because JavaScript built them.
Try changing a price or name inside `data.js` and refresh — the grid
should reflect your change immediately (you may need to clear
`localStorage` first, since the seed data only loads once — see the
troubleshooting note at the end of this guide).

---

## Step 6 — Make a product card clickable → open its details page

1. Still in `js/products.js`, add a single `"click"` event listener on
   the **grid container itself** — not on each individual card. This
   technique (listening on a parent and figuring out what was clicked)
   is called event delegation, and it means new cards you render later
   are automatically clickable too, without extra listeners.
2. Inside the listener, use `event.target.closest(".card")` to find the
   nearest ancestor `.card` element to whatever was actually clicked
   (the person might click the image, the price, anywhere inside the
   card).
3. If `closest()` returns `null` (meaning they clicked empty grid space,
   not a card), `return` immediately and do nothing.
4. If a card was found, read its `data-id` attribute using
   `.dataset.id`.
5. Redirect the browser to the details page, appending the id as a URL
   query parameter — something like
   `Product-Details.html?id=` followed by the id you just read.

**Test it:** click each of the six cards in turn and confirm the address
bar shows a different `?id=` value each time.

---

## Step 7 — Render the Product Details page from the clicked product

### 7.1 Prepare the HTML first

Add `id` attributes to every part of the details page that needs to
change per product: the breadcrumb's current-page text, the product
title, price, description, each of the four gallery images, and the
"Add to Bag" button. Reuse ids like `pdp-title`, `pdp-price`,
`pdp-desc`, `pdp-image`, `pdp-image-2`, `pdp-image-3`, `pdp-image-4`, and
`add-to-bag-btn` — or your own naming, as long as you're consistent.

Link `js/data.js`, `js/cart-badge.js`, `js/cart.js` (built in the next
step), then `js/product-details.js`.

### 7.2 Build the rendering logic

1. Use the built-in `URLSearchParams` on `window.location.search` to
   read the `id` value out of the current page's URL.
2. Pass that id into `getProductById()` from `data.js` to look up the
   matching product.
3. If no product is found (`undefined`), redirect the visitor back to
   `Product-All-Product.html` rather than showing a broken page.
4. If a product **is** found, set the text content of your title, price
   (formatted with `₵` and two decimals), and description elements
   using the matching fields on the product object.
5. Set the `src` of all four gallery `<img>` elements to the product's
   `image` field (you only have one image per product right now — the
   gallery will just show the same photo four times, which is fine for
   this stage).
6. Update `document.title` to include the product's name — a nice touch
   for the browser tab.

**Test it:** click through from the products grid again — the details
page should now show the correct title, price, and photo for whichever
card you clicked. Try changing the URL's `?id=` number by hand and
reloading to confirm different products load correctly.

---

## Step 8 — Add to Bag functionality (`js/cart.js`)

This file's functions get reused by both the details page and the bag
page, so keep it separate from `product-details.js`.

1. Write a function `getCart()` that reads `luxeCart` from
   `localStorage`, parses it, and returns an empty array if nothing is
   stored yet.
2. Write a function `saveCart(cart)` that takes an array and saves it
   back into `localStorage` under `luxeCart`, converting it to text
   first.
3. Write a function `addToCart(product)` that:
   - Calls `getCart()` to get the current array.
   - Uses `.find()` to check whether an item with the same `id` is
     already in the cart.
   - If it is, increase that existing item's `qty` by 1 instead of
     adding a duplicate row.
   - If it isn't, push a new object onto the array containing whatever
     fields the bag page will need to display later: `id`, `name`,
     `variant`, `price`, `image`, and `qty` set to `1`.
   - Calls `saveCart()` with the updated array.
   - Calls `updateCartBadge()` (from `cart-badge.js`) so the header
     number refreshes immediately without needing a page reload.

### 8.1 Wire up the button on the details page

Back in `js/product-details.js`, inside the block where the product was
successfully found, add a click listener on your `#add-to-bag-btn`
element. When clicked, it should call `addToCart(product)` — using the
same `product` variable you already looked up earlier in that file — and
optionally show a simple confirmation (an `alert()` is fine for now).

**Test it:** click "Add to Bag" on a details page and watch the header
badge increase without a reload. Click it several times on the same
product and confirm — by checking `localStorage` in DevTools — that it's
incrementing `qty` on one entry, not creating duplicate rows.

---

## Step 9 — Render the Shopping Bag page from `localStorage`

### 9.1 Prepare the HTML first

1. Delete the three hardcoded `<article class="item-card">` blocks
   inside `<div class="items" id="items">`, leaving the container empty.
2. Link `js/data.js`, `js/cart-badge.js`, `js/cart.js`, then `js/bag.js`.

### 9.2 Build the rendering logic

1. Write a small formatting helper (a function like `fmt(number)`) that
   turns a plain number into a `₵`-prefixed string with two decimal
   places — you'll use this in several places on this page.
2. Write a function `renderItemCard(item)` that returns the HTML string
   for one bag row, matching your existing `.item-card` markup: image,
   name, variant/meta text, a remove button, the quantity stepper
   (minus button, current quantity, plus button), and the line's total
   price (`item.price * item.qty`, formatted). Set `data-id="${item.id}"`
   on the `<article>` so you can identify it later, same idea as the
   product cards.
3. Write a function `renderBag()` that:
   - Calls `getCart()` to get the current array.
   - Maps every item through `renderItemCard`, joins the strings, and
     sets it as the `innerHTML` of your `#items` container.
   - Calls a second function (below) to refresh the summary numbers.
4. Write a function `recalcSummary(cart)` that:
   - Sums every item's `qty` for a total item count.
   - Sums every item's `price * qty` for the subtotal.
   - Calculates tax as subtotal times a tax rate you choose (e.g. 0.08
     for 8%).
   - Adds subtotal and tax together for the total.
   - Updates the subtotal label text (including the item count), and
     the subtotal, tax, and total values elsewhere in the summary card,
     plus the "You have N items..." sentence near the top of the page.
5. Add a single `"click"` listener on the `#items` container (event
   delegation again, same pattern as Step 6):
   - Find the closest `.item-card` ancestor of whatever was clicked; if
     none, `return`.
   - Read that card's `data-id`, convert it to a number, and use
     `getCart()` plus `.find()` to locate the matching cart item.
   - If the click was on the plus button, increase that item's `qty` by
     1.
   - If the click was on the minus button, decrease `qty` by 1, but only
     if it's currently greater than 1 (don't let it go to zero this
     way — use the remove button for that).
   - If the click was on the remove button, find that item's position in
     the array with `.findIndex()` and remove it using `.splice()`.
   - After handling whichever case applied, call `saveCart()` with the
     modified array, call `updateCartBadge()`, and call `renderBag()`
     again so the page redraws with the new numbers.
6. Call `renderBag()` once, at the bottom of the file, so the page
   populates as soon as it loads.

**Test it:** add a couple of different products from the shop, then open
the bag page — confirm the right items, images, and prices appear. Use
the `+`, `–`, and remove controls and confirm the subtotal/tax/total
update instantly. **Refresh the page** and confirm everything is still
there — that's the proof it's genuinely saved, not just held in memory.

---

## Testing checklist (do these in order)

1. Sign up on `Sign-Up.html` → should land on the Products page.
2. DevTools → Application → Local Storage → confirm `luxeUsers` and
   `luxeCurrentUser` exist.
3. Log in on `Log-In.html` with the same credentials in a new tab.
4. Confirm all 6 product cards render on the Products page from
   `data.js`, not typed-out HTML.
5. Click a card → URL should change to `Product-Details.html?id=X` with
   the matching product shown.
6. Click "Add to Bag" → header bubble count should go up immediately.
7. Open the Bag page → your item should appear with correct image,
   name, and price.
8. Use `+` / `–` / remove → totals should recalculate instantly.
9. Refresh the Bag page → everything should still be there.

## Troubleshooting notes

- **Changed `data.js` but the site still shows old data?** Your seed
  function only writes to `localStorage` the first time — once
  `luxeProducts` exists, it's never overwritten automatically. Clear it
  manually in DevTools → Application → Local Storage (right-click →
  delete `luxeProducts`), then refresh.
- **Form submits but the page just reloads and nothing happens?** You
  likely forgot `event.preventDefault()` as the very first line inside
  your submit listener.
- **Clicking a card does nothing, or the details page shows nothing?**
  Check that your card's `id` and the id you're reading with
  `URLSearchParams` are actually being compared as the same *type* —
  wrap the URL value in `Number()` before comparing it to a product's
  numeric `id`.
- **Script throws "X is not a function" or "X is not defined"?** Check
  your `<script>` tag order — `data.js` must load before anything that
  calls `getProducts()`, and `cart.js` must load before
  `product-details.js` or `bag.js` try to call `addToCart()`,
  `getCart()`, or `saveCart()`.
- **Cart badge not updating after Add to Bag?** Make sure you're calling
  `updateCartBadge()` again *after* `saveCart()` — updating storage
  doesn't automatically re-render anything on the page; every visible
  change needs its own explicit function call.
