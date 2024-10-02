const admin = require('firebase-admin');
const serviceAccount = require('./imageguard-b77a9-firebase-adminsdk-f012h-8d36f8b7a1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://imageguard-b77a9.firebaseio.com" // Firebase database URL
});

const db = admin.firestore();
module.exports = db;