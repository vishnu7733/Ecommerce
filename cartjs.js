
// ================== DISPLAY CART ==================
function cartdisp() {
    let carts = JSON.parse(localStorage.getItem("cartprods")) || [];

    // ✅ remove duplicates by id and sum qty
    let uniqueCarts = [];

    carts.forEach(item => {
        let existingIndex = uniqueCarts.findIndex(prod => prod.id === item.id);
        if (existingIndex !== -1) {
            // if duplicate found, add quantities together
            uniqueCarts[existingIndex].qty += (item.qty || 1);
        } else {
            uniqueCarts.push({ ...item, qty: item.qty || 1 });
        }
    });

    // overwrite localStorage with cleaned cart
    localStorage.setItem("cartprods", JSON.stringify(uniqueCarts));

    // now use uniqueCarts instead of carts
    carts = uniqueCarts;


    let defaultcart = document.getElementById("default-cart");
    let cartdispprod = document.getElementById("cartdispprod");
    let totalprice = document.getElementById("totalprice");
    let cartpage = document.getElementById("cart-page");

    // ✅ clear UI
    cartdispprod.innerHTML = "";
    totalprice.innerHTML = "";

    // empty cart
    if (carts.length === 0) {
        defaultcart.style.display = "block";
        cartpage.style.display = "none";
        return;
    } else {
        defaultcart.style.display = "none";
        cartpage.style.display = "block";
    }

    // ================== PRODUCTS ==================
    carts.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "card mb-3 p-3 shadow-sm";

        div.innerHTML = `
        <div class="d-flex align-items-center justify-content-between ">

            <!-- IMAGE -->
            <div style="width: 15%;">
                <img src="${item.image}" class="img-fluid" style="max-width:120px;" />
            </div>

            <!-- TITLE -->
            <div style="width: 40%;margin-left:80px" class="text-start">
                <h6>${item.title.substring(0, 20)}</h6>
            </div>

            <!-- QTY -->
            
            <div style="width: 20%;" class="d-flex justify-content-evenly align-items-center" id="butmove">
                <button class="btn btn-sm btn-secondary" onclick="decreaseQty(${index})">-</button>
                <span class="fw-bold">${item.qty || 1}</span>
                <button class="btn btn-sm btn-secondary" onclick="increaseQty(${index})">+</button>
            </div>

            <!-- SUBTOTAL -->
            <div style="width: 25%;" class="text-end">
                <h6>${item.qty || 1} × $${item.price} = $${Math.round((item.qty || 1) * item.price).toFixed(2)}</h6>
            </div>

        </div>
        `;

        cartdispprod.appendChild(div);
    });

    // ================== TOTAL ==================
    let total = carts.reduce((sum, item) => {
        return sum + item.price * (item.qty || 1);
    }, 0);

    let totalDiv = document.createElement("h4");
    totalDiv.className = "text-end me-3 mt-4";
    totalDiv.className = "text-end me-3 mt-4";

    let shipping = 30;
    let productsTotal = (Math.round(total * 100) / 100); // round to 2 decimals
    let grandTotal = productsTotal + shipping;

    totalDiv.innerHTML = `
    <div class="d-flex justify-content-between">
        <h5>Products (${carts.length})</h5> 
        <div>$${productsTotal.toFixed(2)}</div>
    </div>
    <div class="d-flex justify-content-between">
        <h4>Shipping</h4>
        <h4>$${shipping.toFixed(2)}</h4>
    </div>
    <div class="d-flex justify-content-between">
        <h5>Total</h5> 
        <div>$${grandTotal.toFixed(2)}</div>
    </div>
    <div class="text-center mt-3">
        <button class="btn btn-dark" >Go to Checkout</button>
    </div>


`;


    totalprice.appendChild(totalDiv);
}

// ================== INCREASE ==================
function increaseQty(index) {
    let carts = JSON.parse(localStorage.getItem("cartprods")) || [];

    carts[index].qty = (carts[index].qty || 1) + 1;

    localStorage.setItem("cartprods", JSON.stringify(carts));
    cartdisp();
    updateCartLength();
}

// ================== DECREASE ==================
function decreaseQty(index) {
    let carts = JSON.parse(localStorage.getItem("cartprods")) || [];

    if ((carts[index].qty || 1) > 1) {
        carts[index].qty -= 1;
    } else {
        carts.splice(index, 1); // remove if qty = 0
    }

    localStorage.setItem("cartprods", JSON.stringify(carts));
    cartdisp();
    updateCartLength();
}

// ================== LOAD ==================
cartdisp();
function updateCartLength() {
    let carts = JSON.parse(localStorage.getItem("cartprods")) || [];
    let prodlengthEls = document.getElementsByClassName("prod-length");

    // calculate total quantity
    let totalQty = carts.reduce((sum, item) => sum + (item.qty || 1), 0);

    // update all elements with class "prod-length"
    for (let el of prodlengthEls) {
        el.innerHTML = `${totalQty}`;
    }
}
updateCartLength();  