const admin = require('firebase-admin');
const { FIREBASE_SERVICE_ACCOUNT, FIREBASE_PROJECT_ID } = require('./config');
const path = require('path');

let db = null;

if (FIREBASE_SERVICE_ACCOUNT) {
let serviceAccount;
if (FIREBASE_SERVICE_ACCOUNT.trim().startsWith('{')) {
serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
} else {
serviceAccount = require(path.resolve(FIREBASE_SERVICE_ACCOUNT));
}

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
projectId: FIREBASE_PROJECT_ID || serviceAccount.project_id
});
db = admin.firestore();
console.log('✅ Firebase initialized');
} else {
console.warn('⚠️ No Firebase service account provided, using in-memory DB');
}

module.exports = db;