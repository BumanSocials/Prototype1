let menu = [];
let cart = {};

function fetchMenu() {
fetch('/api/menu').then(r => r.json()).then(data => {
menu = data.menu;
renderMenu();
});
}

function renderMenu() {
const el = document.getElementById('menuList');
el.innerHTML = '';
menu.forEach(item => {
const div = document.createElement('div');
div.innerHTML = `${item.name} - ₹${item.price} <button onclick="addToCart('${item.id}')">Add</button>`;
el.appendChild(div);
});
}

function addToCart(id) {
cart[id] = (cart[id] || 0) + 1;
renderCart();
}

function renderCart() {
const el = document.getElementById('cartItems');
el.innerHTML = '';
if (Object.keys(cart).length === 0) return el.textContent = 'Cart is empty';
for (let id in cart) {
const item = menu.find(m => m.id === id);
el.innerHTML += `${item.name} x ${cart[id]}<br/>`;
}
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
const items = Object.keys(cart).map(id => ({ id, qty: cart[id] }));
const customer = {
name: document.getElementById('custName').value,
phone: document.getElementById('custPhone').value
};
fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items, customer }) })
.then(r => r.json()).then(res => {
if (res.ok) {
document.getElementById('result').innerHTML = `✅ Order Placed! ID: <b>${res.orderId}</b>`;
cart = {}; renderCart();
}
});
});

let trackingInterval = null;

document.getElementById('startTrackingBtn').addEventListener('click', () => {
  const orderId = document.getElementById('trackOrderId').value.trim();
  if (!orderId) return alert("Please enter an Order ID");

  // Clear any existing interval so multiple clicks don’t stack
  if (trackingInterval) clearInterval(trackingInterval);

  // Function to fetch and update order status
  const checkStatus = () => {
    fetch(`/api/track/${orderId}`)
      .then(res => res.json())
      .then(data => {
        const el = document.getElementById('trackResult');
        if (data.ok) {
          el.innerHTML = `📡 Order Status: <b>${data.status}</b>`;
        } else {
          el.innerHTML = `❌ Order Not Found`;
          clearInterval(trackingInterval);
        }
      })
      .catch(err => {
        document.getElementById('trackResult').innerHTML = `⚠️ Error: ${err}`;
      });
  };

  // Run immediately
  checkStatus();

  // Start polling every 5 seconds
  trackingInterval = setInterval(checkStatus, 5000);
});


document.getElementById('trackBtn').addEventListener('click', () => {
const orderId = document.getElementById('trackId').value.trim();
if (!orderId) return alert('Please enter your Order ID');


fetch(`http://127.0.0.1:3000/api/track/${orderId}`)
.then(r => r.json())
.then(res => {
if (res.ok) {
document.getElementById('trackResult').innerHTML = `📦 Order <b>${orderId}</b> is currently: <b>${res.status}</b>`;
} else {
document.getElementById('trackResult').innerHTML = `❌ Order not found.`;
}
})
.catch(() => {
document.getElementById('trackResult').innerHTML = `⚠️ Could not fetch order status.`;
});
});

fetchMenu();