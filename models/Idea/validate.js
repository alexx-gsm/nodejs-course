const Validator = require('validator')
const isEmpty = require('../../helpers/is-empty')

module.exports = (data) => {
    let errors = {}

    // check title
    data.title = !isEmpty(data.title) ? data.title : ''

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Please add a title'
    }

    // check details
    data.details = !isEmpty(data.details) ? data.details : ''

    if (Validator.isEmpty(data.details)) {
        errors.details = 'Please add some details'
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }
}
