const Validator = require('validator')
const isEmpty = require('../../helpers/is-empty')

module.exports = (data) => {
    let errors = {}

    // email
    data.email = !isEmpty(data.email) ? data.email : ''
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }
    if (!isEmpty(data.email) && !Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    // password
    data.password = !isEmpty(data.password) ? data.password : ''
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}
