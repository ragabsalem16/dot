// Donut Shop - Cart and Checkout System with Submify

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
const orderDetailsInput = document.getElementById('orderDetailsInput');

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
    cartTotalSpan.textContent = total.toFixed(2) + " egp";
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
        cart.push({
            ...item,
            quantity: 1
        });
    }
    updateCart();
}

// إضافة المنتجات للسلة
document.addEventListener('DOMContentLoaded', function() {
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
        if (cart.length === 0) {
            alert('السلة فارغة! يرجى إضافة منتجات أولاً');
            return;
        }
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
        let summaryHTML = '';
        let total = 0;
        cart.forEach(item => {
            summaryHTML += `<p>${item.name} x${item.quantity} <strong>${(item.price * item.quantity).toFixed(2)} egp </strong></p>`;
            total += item.price * item.quantity;
        });
        summaryHTML += `<p><strong>الإجمالي: ${total.toFixed(2)} egp </strong></p>`;
        checkoutSummary.innerHTML = summaryHTML;
    });

    closeCheckout.addEventListener('click', () => checkoutModal.style.display = 'none');

    // معالجة إرسال الطلب مع Submify
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault(); // نمنع الإرسال الافتراضي

        if (cart.length === 0) {
            alert('السلة فارغة! يرجى إضافة منتجات أولاً');
            return;
        }

        // تحضير بيانات الطلب
        let cartText = '';
        let total = 0;
        cart.forEach(item => {
            cartText += `${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)} egp | `;
            total += item.price * item.quantity;
        });

        // إضافة بيانات العميل
        const customerName = document.querySelector('input[name="name"]').value;
        const customerPhone = document.querySelector('input[name="phone"]').value;
        const customerAddress = document.querySelector('textarea[name="address"]').value;
        const paymentMethod = document.querySelector('select[name="payment_method"]').value;

        // إنشاء نص الطلب الكامل
        const fullOrderText = `
بيانات العميل:
الاسم: ${customerName}
الهاتف: ${customerPhone}
العنوان: ${customerAddress}
طريقة الدفع: ${paymentMethod}

تفاصيل الطلب:
${cartText}
الإجمالي: ${total.toFixed(2)} egp
        `;

        // وضع البيانات في الحقل المخفي
        orderDetailsInput.value = fullOrderText.trim();

        // إرسال الطلب
        const formData = new FormData(checkoutForm);

        fetch('https://submify.vercel.app/ragabsalem665@gmail.com', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً لتأكيد الطلب.');
                    // إعادة تعيين السلة والنموذج
                    cart = [];
                    updateCart();
                    checkoutForm.reset();
                    checkoutModal.style.display = 'none';
                } else {
                    throw new Error('فشل في إرسال الطلب');
                }
            })
            .catch(error => {
                console.error('خطأ:', error);
                alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
            });
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
});
