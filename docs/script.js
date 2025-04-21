import data from "./data.json" with { type: "json" };

// initialize cart and foodImgHTML
let cart = {};
let foodImgHTML = "";

const productGridRow = document.querySelector(".product-grid-row");
const cartColBody = document.querySelector(".cart-col-body");
const backdrop = document.querySelector(".backdrop");
const orderConfirmationDiv = document.querySelector(".order-confirmation-div");
const foodOrdered = document.querySelector(".food-ordered");
const startNewOrderBtn = document.querySelector(".start-new-order-btn");

for (let i = 0; i < data.length; i++) {
    // replace spaces in food name with dashes and convert text to lower case
    const sanitizedName = data[i].name.replace(/\s+/g, "-").toLowerCase();

    // change food image based on screen size
    if (window.matchMedia("(max-width: 576px)").matches) {
        foodImgHTML = `<img src="${data[i].image.desktop}" class="card-img img-fluid mb-3" id="img-${sanitizedName}" alt="${data[i].name}" />`;
    }

    else if (window.matchMedia("(min-width: 577px) and (max-width: 992px)").matches) {
        foodImgHTML = `<img src="${data[i].image.tablet}" class="card-img img-fluid mb-3" id="img-${sanitizedName}" alt="${data[i].name}" />`;
    }

    else {
        foodImgHTML = `<img src="${data[i].image.desktop}" class="card-img img-fluid mb-3" id="img-${sanitizedName}" alt="${data[i].name}" />`;
    }

    // populate DOM with food cards
    productGridRow.insertAdjacentHTML("beforeend", `
        <div class="col">
            <div class="card h-100 position-relative">
                ${foodImgHTML}
                <button class="btn add-to-cart-btn position-absolute px-3 py-2 d-flex align-items-center" id="add-to-cart-${sanitizedName}">
                    <img src="./assets/images/icon-add-to-cart.svg" class="mx-2" />Add to Cart
                </button>
                <div class="card-body px-0">
                    <p class="food-category">${data[i].category}</p>
                    <p class="food-title">${data[i].name}</p>
                    <p class="food-price">$${data[i].price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `);

    const addToCartBtn = document.getElementById(`add-to-cart-${sanitizedName}`);
    let currentQty = 0;
    let foodImg = document.getElementById(`img-${sanitizedName}`);

    // change design of addToCartBtn
    addToCartBtn.addEventListener("click", (e) => {
        e.currentTarget.innerHTML = `
            <div class="change-qty-icon-div d-flex align-items-center justify-content-center" id="decrease-qty-${sanitizedName}">
                <img src="./assets/images/icon-decrement-quantity.svg" alt="decrease quantity icon"/>
            </div>
            <span class="qty mx-4" id="qty-${sanitizedName}">${currentQty}</span>
            <div class="change-qty-icon-div d-flex align-items-center justify-content-center" id="increase-qty-${sanitizedName}">
                <img src="./assets/images/icon-increment-quantity.svg" alt="increase quantity icon"/>
            </div>
        `;

        // add border to img of selected food
        foodImg.style.border = "0.125rem solid hsl(14, 86%, 42%)";
        e.currentTarget.style.backgroundColor = "hsl(14, 86%, 42%)";

        const decreaseQty = document.getElementById(`decrease-qty-${sanitizedName}`);
        const increaseQty = document.getElementById(`increase-qty-${sanitizedName}`);
        const qtyDisplay = document.getElementById(`qty-${sanitizedName}`);

        // decrease qty ordered
        decreaseQty.addEventListener("click", (ev) => {
            ev.stopPropagation();
            currentQty--;

            if (currentQty <= 0) {
                // delete food from cart if qty is 0
                currentQty = 0;
                delete cart[sanitizedName];

                // reset addToCartBtn if qty is 0
                addToCartBtn.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" class="mx-2" />Add to Cart`;
                addToCartBtn.style.backgroundColor = "";

                //remove border from img of food
                foodImg.style.border = "none";
            }

            else {
                qtyDisplay.textContent = currentQty;
                cart[sanitizedName] = {
                    name: data[i].name,
                    qty: currentQty,
                    price: data[i].price
                };
            }

            updateCartColBody();
            updateCartLength();
        });

        // increase qty ordered
        increaseQty.addEventListener("click", (ev) => {
            ev.stopPropagation();
            currentQty++;
            qtyDisplay.textContent = currentQty;

            // add food to cart
            cart[sanitizedName] = {
                name: data[i].name,
                qty: currentQty,
                price: data[i].price
            };

            updateCartColBody();
            updateCartLength();
        });

        qtyDisplay.addEventListener("click", (ev) => {
            ev.stopPropagation();
            currentQty = 0;
            delete cart[sanitizedName];

            addToCartBtn.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" class="mx-2" />Add to Cart`;
            addToCartBtn.style.backgroundColor = "";
            foodImg.style.border = "none";

            updateCartColBody();
            updateCartLength();
        });
    });
}

// functions
// update cartColBody based on food added
function updateCartColBody() {
    const cartColBody = document.querySelector(".cart-col-body");

    if (Object.keys(cart).length === 0) {
        cartColBody.classList.add("align-items-center");
        cartColBody.innerHTML = `
            <img src="./assets/images/illustration-empty-cart.svg" alt="empty cart image"/>
            <p class="cart-notice">Your added items will appear here</p>
        `;
        return;
    }

    cartColBody.classList.remove("align-items-center");

    let cartHTML = "";
    let cartHTMLConfirmed = "";
    let totalPrice = 0;

    for (let key in cart) {
        const food = cart[key];

        // add price per food to total price
        totalPrice += food.qty * food.price;
        cartHTML += `
            <div class="cart-row d-flex justify-content-between align-items-center pt-3">
                <div class="order-details">
                    <p class="cart-food-title">${food.name}</p>
                    <p>
                        <span class="qty-added">${food.qty}x</span>
                        <span class="individual-food-price">@ $${food.price.toFixed(2)}</span>
                        <span class="price-per-food">$${(food.qty * food.price).toFixed(2)}</span>
                    </p>
                </div>
                <button class="remove-item-btn d-flex justify-content-center align-items-center" data-key="${key}">
                    <img src="./assets/images/icon-remove-item.svg" alt="remove item icon"/>
                </button>
            </div>
            <hr>
        `;

        cartHTMLConfirmed += `
                                <div class="cart-row d-flex justify-content-between align-items-center pt-3">
                                    <div class="order-details">
                                        <p class="cart-food-title">${food.name}</p>
                                        <p>
                                            <span class="qty-added">${food.qty}x</span>
                                            <span class="individual-food-price">@ $${food.price.toFixed(2)}</span>
                                        </p>
                                    </div>
                                    <span class="price-per-food">$${(food.qty * food.price).toFixed(2)}</span>
                                </div>
                                <hr>
                            `;
        
    }

    foodOrdered.innerHTML = cartHTMLConfirmed;

    cartHTML += `
                <div class="order-total-div d-flex justify-content-between align-items-center my-2">
                    <p class="order-total-p">Order Total</p>
                    <p class="total-price">$${totalPrice.toFixed(2)}</p>
                </div>
                <div class="carbon-neutral-div d-flex justify-content-center align-items-center py-3 px-1 mx-1">
                    <img src="./assets/images/icon-carbon-neutral.svg" alt="Carbon Neutral Icon"/>
                    <p class="m-0 text-center">This is a <span class="carbon-neutral">carbon-neutral</span> delivery</p>
                </div>
                <button class="btn confirm-order-btn py-2 px-2 mt-4 mb-2">Confirm Order</button>
                `;

    // remove item from cart if button is clicked
    cartColBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".remove-item-btn");
        if (btn) {
            const key = btn.getAttribute("data-key");

            if (key) {
                delete cart[key];
                updateCartColBody();
                updateCartLength();
            }
        }

        const confirmBtn = e.target.closest(".confirm-order-btn");

        if (confirmBtn) {
            confirmOrder();
        }
    });

    cartColBody.innerHTML = cartHTML;
}

function updateCartLength() {
    const cartLengthElement = document.querySelector(".cart-length");
    let totalItems = 0;

    for (let key in cart) {
        totalItems += cart[key].qty;
    }

    cartLengthElement.textContent = totalItems;
}

// confirm order
function confirmOrder() {
    backdrop.style.display = "block";
    orderConfirmationDiv.classList.add("d-flex", "flex-column");
    orderConfirmationDiv.classList.remove("bottom-0", "start-50", "translate-middle-x", "w-100", "m-0", "top-50", "translate-middle", "w-50");

    if (window.matchMedia("(max-width: 576px)").matches) {
        orderConfirmationDiv.classList.add("bottom-0", "start-50", "translate-middle-x", "w-100", "m-0");
    } 
    
    else {
        orderConfirmationDiv.classList.add("top-50", "start-50", "translate-middle", "w-50");
    }    

    startNewOrderBtn.addEventListener("click", () => {
        backdrop.style.display = "none";
        orderConfirmationDiv.classList.remove("d-flex", "flex-column");
        cart = {};

        // reset cart display
        cartColBody.classList.add("align-items-center");
        cartColBody.innerHTML = `
            <img src="./assets/images/illustration-empty-cart.svg" alt="empty cart image"/>
            <p class="cart-notice">Your added items will appear here</p>
        `;

        // reset all "Add to Cart" buttons
        const addToCartBtnAll = document.querySelectorAll(".add-to-cart-btn");

        addToCartBtnAll.forEach(btn => {
            btn.innerHTML = `<img src="./assets/images/icon-add-to-cart.svg" class="mx-2" alt="add to cart icon"/>Add to Cart`;
            btn.style.backgroundColor = "";
        });

        // remove border from any selected food images
        const foodImages = document.querySelectorAll(".card-img");
        foodImages.forEach(img => {
            img.style.border = "none";
        });

        updateCartLength();
    });
}