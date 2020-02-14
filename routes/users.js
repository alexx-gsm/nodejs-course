const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

// model
const User = require('../models/user')
// validators
const registerValidate = require('../models/user/register-validate')
const loginValidate = require('../models/user/login-validate')

/**
 ** @route   GET users/register
 *? @desc    Register page
 *! @access  Public
 */
router.get('/register', (req, res) => {
    res.render('users/register')
})

/**
 ** @route   GET users/login
 *? @desc    Login page
 *! @access  Public
 */
router.get('/login', (req, res) => {
    res.render('users/login')
})

/**
 ** @route   GET users/logout
 *? @desc    Logout process
 *! @access  Public
 */
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('info', 'You are logged out')
    res.redirect('/users/login')
})

/**
 ** @route   POST users/login
 *? @desc    Login process: check credentials
 *! @access  Public
 */
router.post('/login', (req, res, next) => {
    const { errors, isValid } = loginValidate(req.body)

    const { email, password } = req.body

    // validate form data
    if (!isValid) {
        return res.render('users/login', { errors, email, password })
    }

    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.render('users/login', { error: 'Invalid email or password.', email })
        }

        req.login(user, (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/ideas')
        })
    })(req, res, next)
})

/**
 ** @route   POST users/register
 *? @desc    Register process
 *! @access  Public
 */
router.post('/register', async (req, res) => {
    const { errors, isValid } = registerValidate(req.body)
    const { name, email, password, password2 } = req.body

    // validate form data
    if (!isValid) {
        return res.render('users/register', { errors, name, email, password, password2 })
    }

    try {
        const user = await User.findOne({ email })

        if (user) {
            errors.email = 'Email already exists'
            return res.render('users/register', { errors, name, email, password, password2 })
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err

                    const newUser = new User({ name, email, hash })

                    newUser.save()
                    req.flash('info', 'Account created')
                    req.flash('email', email)
                    res.redirect('/users/login')
                })
            })
        }
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

module.exports = router
