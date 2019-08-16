const firebase = require('firebase');
const {db, adming} = require('../utilities/admin')
const { validateSignupData } = require('../utilities/dataValidator')
const myFirebaseConfiguration = require('../utilities/myFirebaseConfiguration');


firebase.initializeApp(myFirebaseConfiguration);

const signUp = (req, res) => {
    /** get the input information from the user */
    const newUser = {
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
        handle: req.body.handle
    }

    /** validate the input data:
     * Valid : boolean flag
     * Errors : object with errors
     */

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status (400).json(errors);

    /** create a new user - validation has been passed */
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(JWT_token => {
            token = JWT_token;
            const userCredentials = {
                handle : newUser.handle,
                email : newUser.email,
                createdAt : new Date().toISOString()
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err =>{
            console.log(err);
            if(err.code === 'auth/email-already-in-use')
                return res.status(400).json({email: 'Email is alreay in use..'})
            else
                return res.status(500).json({general: 'Something we wrong. Please try again..'})
        })
}


module.exports = {
    signUp
}