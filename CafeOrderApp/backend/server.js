const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { PORT } = require('./config');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/track', require('./routes/track'));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));