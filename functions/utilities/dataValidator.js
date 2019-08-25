const isEmailFormat = (email2check) => {
    /** use a Reg Ex to check the email pattern*/
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email2check.match(regEx);
}

const isEmpty = dataToCheck => {
    /** delete the leading and ending space */
    if(dataToCheck.trim() === '')
        return true;
    else 
        return false;
}   

const validateSignupData = (dataToValidate) => {
    let errors = {};

    if (isEmpty(dataToValidate.email)) 
        errors.email = 'Please, enter you email'
    else if(!isEmailFormat(dataToValidate.email))
        errors.email = 'Please, enter a valid email'
    
    if (isEmpty(dataToValidate.password))
        errors.password = 'Please, enter your password'
    if (dataToValidate.password != dataToValidate.confirmPassword)
        errors.confirmPassword = 'Passwords must match'
    
    if (isEmpty(dataToValidate.handle))
        errors.handle = 'Please, tell us your name'
    
    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
}

const validateLoginData = (dataToValidate) => {
    let errors = {};

    if(isEmpty(dataToValidate.email))
        errors.email = 'Please, enter your email'
    if(isEmpty(dataToValidate.password))
        errors.password = 'Please, enter your password'
    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
}


const validateNoteData = dataToValidate => {
    let errors = {};

    if(isEmpty(dataToValidate.title)) {
        errors.title = 'Your note needs a title!'
    }
    if(isEmpty(dataToValidate.body)) {
        errors.body = 'Note cannot be empty!'
    }

    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }

}
module.exports = {
    validateSignupData,
    validateLoginData,
    validateNoteData
}