const express = require('express');
const router = express.Router();

// Sample in-memory menu (could be fetched from Firestore)
const menu = {
'coffee-1': { id: 'coffee-1', name: 'Flat White', price: 150 },
'toast-1': { id: 'toast-1', name: 'Avocado Toast', price: 220 },
'cake-1': { id: 'cake-1', name: 'Chocolate Cake', price: 180 }
};

router.get('/', (req, res) => {
res.json({ ok: true, menu: Object.values(menu) });
});

module.exports = router;