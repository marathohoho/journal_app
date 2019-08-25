const {db, admin} = require('../utilities/admin');

const FirebaseAuthenticationMiddleware = (req, res, next) => {
    let idToken;
    /** check if we have a token and it is a Bearer token, extract the token*/
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
        idToken = req.headers.authorization.split('Bearer ')[1];
    else {
        console.log('No Token Found');
        return res.status(403).json({error : 'Unauthorized'});
    }   

    admin.auth().verifyIdToken(idToken)
        .then(decodedIdToken => {
            req.user =decodedIdToken;
            /** find and return the user who the token belongs to */
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then(userFound => {
            /** "pass" the parameters with the next() */
            req.user.handleId = userFound.docs[0].data().userId;
            return next();
        })
        .catch(err => {
            console.log('Error while veryfying the token', err);
            return res.status(403).json(err);
        })
    
}

module.exports = {
    FirebaseAuthenticationMiddleware
}