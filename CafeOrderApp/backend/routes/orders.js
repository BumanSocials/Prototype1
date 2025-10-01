const express = require('express');
const router = express.Router();
const db = require('../firebase');
const crypto = require('crypto');
const { SYSTEM_API_KEY } = require('../config');

let InMemoryOrders = {};
let exportedOrderId = null;

function generateOrderId() {
return 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function saveOrder(order) {
if (db) await db.collection('orders').doc(order.id).set(order);
else InMemoryOrders[order.id] = order;
}

async function getOrder(orderId) {
if (db) {
const doc = await db.collection('orders').doc(orderId).get();
return doc.exists ? doc.data() : null;
} else return InMemoryOrders[orderId] || null;
}

// POST /api/orders
router.post('/', async (req, res) => {
const items = req.body.items || [];
if (!items.length) return res.status(400).json({ ok: false, error: 'No items' });

const order = {
id: generateOrderId(),
created_at: new Date().toISOString(),
items,
customer: req.body.customer || {},
payment_method: 'pay_at_counter',
status: 'placed'
};

await saveOrder(order);
exportedOrderId = order.id;
res.json({ ok: true, orderId: order.id });
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
const order = await getOrder(req.params.id);
if (!order) return res.status(404).json({ ok: false });
res.json({ ok: true, order });
});

// PUT /api/orders/:id/status
router.put('/:id/status', async (req, res) => {
if (req.header('X-Admin-Key') !== SYSTEM_API_KEY) return res.status(401).json({ ok: false });
const order = await getOrder(req.params.id);
if (!order) return res.status(404).json({ ok: false });
order.status = req.body.status;
await saveOrder(order);
res.json({ ok: true, order });
});

// GET /api/orders/exported/latest
router.get('/exported/latest', (req, res) => {
if (req.header('X-Auth-System-Key') !== SYSTEM_API_KEY) return res.status(401).json({ ok: false });
res.json({ ok: true, exportedOrderId });
});

module.exports = router;