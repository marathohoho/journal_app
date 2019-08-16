const isEmailFormat = (email2check) => {
    /** use a Reg Ex to check the email pattern*/
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email2check.match(regEx);
}

const isEmpty = (email2check) => {
    /** delete the leading and ending space */
    if(email2check.trim() === '')
        return true;
    else 
        return false;
}   

const validateSignupData = (dataToValidate) => {
    let errors = {};

    if (isEmpty(dataToValidate.email)) 
        errors.email = 'Must not be empty'
    else if(!isEmailFormat(dataToValidate.email))
        errors.email = 'Must be a valid email'
    
    if (isEmpty(dataToValidate.password))
        errors.password = 'Must not be empty'
    if (dataToValidate.password != dataToValidate.confirmPassword)
        errors.confirmPassword = 'Passwords must match'
    
    if (isEmpty(dataToValidate.handle))
        errors.handle = 'Please, tell us your name'
    
    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
}

module.exports = {
    validateSignupData
}