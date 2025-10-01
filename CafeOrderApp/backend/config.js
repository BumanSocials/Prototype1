require('dotenv').config();

module.exports = {
PORT: process.env.PORT || 3000,
FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT || null,
FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || null,
SYSTEM_API_KEY: process.env.SYSTEM_API_KEY || 'change-me'
};