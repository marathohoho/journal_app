const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp();

const db = admin.firestore();

module.exports = {
    admin,
    db,
    FieldValue
}