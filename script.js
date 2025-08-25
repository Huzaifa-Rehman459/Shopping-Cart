const foodItems = [
  { id: 1, name: "Chicken Tikka", price: 14, img: "main.avif" },
  { id: 2, name: "Biryani", price: 20, img: "biryani.avif" },
  { id: 3, name: "Daal Chaval", price: 10, img: "daal.avif" },
  { id: 4, name: "Grilled Fish", price: 30, img: "fish.avif" },
  { id: 5, name: "Kebab", price: 8, img: "kebab.avif" },
  { id: 6, name: "Custard", price: 5, img: "custard.avif" },
];

//Login & Food Section Elements
let loginForm = document.querySelector("#login-form");
let emailInp = document.querySelector("#email");
let passInp = document.querySelector("#password");
let signBtn = document.querySelector("#signBtn");
let passRemove = document.querySelector("#passRemove");
let errorText = document.querySelector("#errorText");
let foodSection = document.querySelector("#foodSection");
let cardsContainer = document.getElementById("cards");

//Cart Variables
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let total = 0;
let itemCount = 0;

// ----------- Food Menu → Logout to Login ----------
let foodMenuHeading = document.querySelector("#menuHeading");
foodMenuHeading.addEventListener("click", () => {
  // clear login state
  localStorage.removeItem("isLoggedIn");

  // show login, hide food section
  foodSection.style.display = "none";
  loginForm.classList.remove("hide");
});

// ----------- Check login persistence ------------
window.addEventListener("DOMContentLoaded", () => {
  let storedUser = JSON.parse(localStorage.getItem("userData"));
  let isLoggedIn = localStorage.getItem("isLoggedIn");

  if (storedUser && isLoggedIn === "true") {
    loginForm.classList.add("hide");
    foodSection.style.display = "flex";
    renderMenu();
    updateCartDisplay();
  } else {
    loginForm.classList.remove("hide");
    foodSection.style.display = "none";
  }
});

// ---------------- Login Function ----------------
loginForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  emailInp.style.border = "";
  passInp.style.border = "";
  errorText.textContent = "";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  let mailInput = emailInp.value.trim();
  let passInput = passInp.value.trim();

  if (mailInput === "" || passInput === "") {
    errorText.textContent = "Please fill in all fields";
    errorText.style.color = "red";
    return;
  }

  if (!emailRegex.test(mailInput)) {
    errorText.textContent = "Invalid Email";
    errorText.style.color = "red";
    emailInp.style.border = "1px solid red";
    return;
  }

  if (!passwordRegex.test(passInput)) {
    errorText.textContent = "Invalid Password";
    errorText.style.color = "red";
    passInp.style.border = "1px solid red";
    return;
  }

  let storedUser = JSON.parse(localStorage.getItem("userData"));

  if (!storedUser) {
    errorText.textContent = "No user found. Please signup first.";
    errorText.style.color = "red";
    return;
  }

  if (mailInput === storedUser.email && passInput === storedUser.password) {
    loginForm.classList.add("hide");
    foodSection.style.display = "flex";

    // store login state
    localStorage.setItem("isLoggedIn", "true");

    renderMenu();
    updateCartDisplay();
    loginForm.reset();
  } else {
    errorText.textContent = "Invalid credentials!";
    errorText.style.color = "red";
  }
});

signBtn.addEventListener("click", () => {
  loginForm.classList.add("hide");
  signupForm.classList.remove("hide");
  loginForm.reset();
});

passRemove.addEventListener("click", () => {
  alert("Sorry! We dont have this feature available");
});

// ----------------- SIGNUP -----------------
let signupForm = document.querySelector("#signup-form");
let usernameInp = document.querySelector("#username");
let email1Inp = document.querySelector("#email1");
let password1Inp = document.querySelector("#password1");

signupForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,15}$/;

  let signMail = email1Inp.value.trim();
  let signPass = password1Inp.value.trim();
  let signUsername = usernameInp.value.trim();

  if (!usernameRegex.test(signUsername)) {
    alert("Please enter a valid Username");
    return;
  }

  if (!emailRegex.test(signMail)) {
    alert("Please enter a valid email address");
    return;
  }

  if (!passwordRegex.test(signPass)) {
    alert("Enter a valid Password");
    return;
  }

  let userData = {
    email: signMail,
    password: signPass,
  };
  localStorage.setItem("userData", JSON.stringify(userData));

  loginForm.classList.remove("hide");
  signupForm.classList.add("hide");
  signupForm.reset();
});

// ----------------- CART SYSTEM -----------------
let cartIcon = document.querySelector("#shoppingCart");
let cartTab = document.querySelector(".cartTab");
let closeBtn = document.querySelector("#closeBtn");

cartIcon.addEventListener("click", () => {
  cartTab.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  cartTab.classList.remove("active");
});

//Render Food Menu
function renderMenu() {
  cardsContainer.innerHTML = foodItems
    .map(
      (item) => `
        <div class="card">
          <img src="${item.img}" alt="${item.name}">
          <div class="dish-info">
            <p class="item-name">Dish Name: ${item.name}</p>
            <span class="price">Price: $${item.price}</span>
          </div>
          <button onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
      `
    )
    .join("");
}

//Add to Cart
function addToCart(id) {
  let selectedItem = foodItems.find((item) => item.id === id);

  let existingItem = cartItems.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      ...selectedItem,
      quantity: 1,
    });
  }

  updateLocalStorage();
  updateCartDisplay();
}

//Update Cart Display
function updateCartDisplay() {
  let cartList = document.querySelector(".cartList");
  let totalAmount = document.querySelector("#totalAmount");
  let cartCount = document.querySelector(".cartCount");

  cartList.innerHTML = "";
  total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  cartItems.forEach((item) => {
    let li = document.createElement("li");
    cartList.innerHTML += `
  <div class="cart-item">
    <img src="${item.img}" class="cart-item-image">
    <div class="cart-item-details">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
    </div>
    <div class="quantity-controls">
      <button onclick="changeQuantity(${item.id}, -1)">-</button>
      <button onclick="changeQuantity(${item.id}, 1)">+</button>
    </div>
    <button class="remove" onclick="removeItem(${item.id})">x</button>
  </div>`;
    cartList.appendChild(li);
  });

  totalAmount.textContent = total.toFixed(2);
  cartCount.textContent = itemCount;
}

//Change Quantity
function changeQuantity(id, amount) {
  let item = cartItems.find((i) => i.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cartItems = cartItems.filter((i) => i.id !== id);
  }

  updateLocalStorage();
  updateCartDisplay();
}

//Remove Item
function removeItem(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  updateLocalStorage();
  updateCartDisplay();
}

//Update Local Storage
function updateLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
