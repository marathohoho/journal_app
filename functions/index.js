/** general imports */
const functions = require('firebase-functions');
const app = require('express')();
const FirebaseAuthentication = require('./utilities/FirebaseAuthentication')

/** import the routes for notes */
const {
    getAllNotes,
    postOneNote
} = require('./handlers/notes')

/** import the routes for user */
const {
    signUp,
    login
} = require('./handlers/users')



/** API Routes for Notes */
app.get('/notes', getAllNotes);
// app.post('/note', FirebaseAuthentication, postOneNote);

/** API Routes for Users */
app.post('/signup', signUp);
app.post('/login', login);


/** Firebase functions that serve the application */
exports.api = functions.region('europe-west2').https.onRequest(app);
