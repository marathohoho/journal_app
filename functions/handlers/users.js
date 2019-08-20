const firebase = require('firebase');
const {db, adming} = require('../utilities/admin')
const { validateSignupData, validateLoginData } = require('../utilities/dataValidator')
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

    if(!valid) return res.status(400).json(errors);

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
                userId : userId, //could do just userId..
                email : newUser.email,
                createdAt : new Date().toISOString()
            }
            return db.doc(`/users/${newUser.handle+userId}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({token});
        })
        .catch(err =>{
            console.log(err);
            if(err.code === 'auth/email-already-in-use')
                return res.status(400).json({email: 'Email is alreay in use..'})
            else if (err.code === 'auth/weak-password')
                return res.status(500).json({password: 'You password is not strong enough'});
            else
                return res.status(500).json({general: 'Something we wrong. Please try again..'})
        })
}

const login = (req, res) => {
    const enteredUser = {
        email : req.body.email,
        password : req.body.password
    }

    const  { valid, errors } = validateLoginData(enteredUser);

    if(!valid) return res.status(400).json(errors);

    /** check the entered data with the authentication service */
    firebase.auth().signInWithEmailAndPassword(enteredUser.email, enteredUser.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token =>{
            return res.json({token});
        })
        .catch(err => {
            return res.status(403).json({ general : 'Wrong credentials, please try again'})
        })
}


// const test = (req,res) => {
//     console.log(req)
//     console.log(req.data())
// }
module.exports = {
    signUp,
    login
}