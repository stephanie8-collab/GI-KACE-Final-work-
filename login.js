const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

function showLoginError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginError.style.display = "none";

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("luxeUsers")) || [];
  const user = users.find((candidate) => candidate.email === email && candidate.password === password);

  if (!user) {
    showLoginError("Email or password is incorrect.");
    return;
  }

  localStorage.setItem("luxeCurrentUser", JSON.stringify({ fullname: user.fullname, email: user.email }));
  window.location.href = "Product-All-Product.html";
});
