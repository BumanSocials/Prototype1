const express = require('express');
const router = express.Router();
const db = require('../firebase');

let InMemoryOrders = {};

async function getOrder(orderId) {
if (db) {
const doc = await db.collection('orders').doc(orderId).get();
return doc.exists ? doc.data() : null;
} else return InMemoryOrders[orderId] || null;
}

router.get('/:id', async (req, res) => {
const order = await getOrder(req.params.id);
if (!order) return res.status(404).json({ ok: false });
res.json({ ok: true, status: order.status });
});

module.exports = router;