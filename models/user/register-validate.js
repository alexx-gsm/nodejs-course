const Validator = require('validator')
const isEmpty = require('../../helpers/is-empty')

module.exports = (data) => {
    let errors = {}

    // check name
    data.name = !isEmpty(data.name) ? data.name : ''

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required'
    }

    // email
    data.email = !isEmpty(data.email) ? data.email : ''
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required'
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid'
    }

    // password
    data.password = !isEmpty(data.password) ? data.password : ''
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required'
    }
    if (data.password !== '' && !Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password is too short. Min 6 simbols'
    }

    // password 2
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Password is required'
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords don't match"
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}
