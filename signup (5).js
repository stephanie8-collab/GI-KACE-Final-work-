const signupForm = document.getElementById("signup-form");
const signupError = document.getElementById("signup-error");

function showSignupError(message) {
  signupError.textContent = message;
  signupError.style.display = "block";
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signupError.style.display = "none";

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    showSignupError("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("luxeUsers")) || [];
  if (users.some((user) => user.email === email)) {
    showSignupError("An account with this email already exists.");
    return;
  }

  users.push({ fullname, email, password });
  localStorage.setItem("luxeUsers", JSON.stringify(users));
  localStorage.setItem("luxeCurrentUser", JSON.stringify({ fullname, email }));
  window.location.href = "Product-All-Product.html";
});
