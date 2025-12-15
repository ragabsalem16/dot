// Donut Shop - Cart and Checkout System (No EmailJS)

// ======= Cart Logic =======
let cart = [];
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSummary = document.getElementById('checkoutSummary');

function updateCart() {
    cartBadge.textContent = cart.length;
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
                <div class="cart-item-details">
                    <strong>${item.name}</strong> - ${item.price.toFixed(2)} egp 
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="changeQuantity('${item.id}',-1)">-</button>
                        ${item.quantity}
                        <button onclick="changeQuantity('${item.id}',1)">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')">×</button>
                </div>
            `;
        cartItemsDiv.appendChild(div);
        total += item.price * item.quantity;
    });
    cartTotalSpan.textContent = total.toFixed(2) + "egp";
}

function changeQuantity(id, delta) {
    cart = cart.map(item => {
        if (item.id === id) {
            item.quantity += delta;
            if (item.quantity < 1) item.quantity = 1;
        }
        return item;
    });
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function addToCart(item) {
    const exist = cart.find(i => i.id === item.id);
    if (exist) {
        exist.quantity++;
    } else {
        cart.push({...item,
            quantity: 1
        });
    }
    updateCart();
}

// إضافة المنتجات للسلة
document.querySelectorAll('.add-to-cart-btn, .add-to-cart-icon').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const parent = e.target.closest('[data-name]');
        if (parent) {
            addToCart({
                id: parent.dataset.id,
                name: parent.dataset.name,
                price: parseFloat(parent.dataset.price)
            });
        }
    });
});

// فتح وإغلاق النوافذ المنبثقة
cartBtn.addEventListener('click', () => cartModal.style.display = 'block');
closeCart.addEventListener('click', () => cartModal.style.display = 'none');

checkoutBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
    let summaryHTML = '';
    let total = 0;
    cart.forEach(item => {
        summaryHTML += `<p>${item.name} x${item.quantity} <strong>${(item.price * item.quantity).toFixed(2)}egp </strong></p>`;
        total += item.price * item.quantity;
    });
    summaryHTML += `<p><strong>الإجمالي: ${total.toFixed(2)} egp </strong></p>`;
    checkoutSummary.innerHTML = summaryHTML;
});

closeCheckout.addEventListener('click', () => checkoutModal.style.display = 'none');


// معالجة إرسال الطلب
checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const payment = document.getElementById('paymentMethod').value;

    let cartText = '';
    let total = 0;
    cart.forEach(item => {
        cartText += `• ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)} egp\n`;
        total += item.price * item.quantity;
    });


    // Order data for display (without email sending)
    const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        payment_method: payment,
        cart_items: cartText,
        order_total: total.toFixed(2) + " egp"
    };
    console.log("Order received:", orderData);

    // Show success message
    alert("تم استلام طلبك بنجاح! سنتواصل معك قريباً لتأكيد الطلب.");

    // Reset cart and close modal
    cart = [];
    updateCart();
    checkoutModal.style.display = 'none';
    checkoutForm.reset();
});

// إغلاق النوافذ عند النقر خارجها
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
});

// فلترة القائمة
document.querySelectorAll('.menu-tabs .tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const filter = this.dataset.filter;

        // تحديث التبويبات النشطة
        document.querySelectorAll('.menu-tabs .tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // فلترة العناصر
        document.querySelectorAll('.menu-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});
