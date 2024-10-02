const admin = require('firebase-admin');
const serviceAccount = require('./imageguard-b77a9-firebase-adminsdk-f012h-8523a8c5d5.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://imageguard-b77a9.firebaseio.com" // Firebase database URL
});

const db = admin.firestore();
module.exports = db;
