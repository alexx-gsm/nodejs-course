const express = require('express')
const router = express.Router()

// Home page
router.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello from Pug view!' })
})

// About page
router.get('/about', (req, res) => {
    res.render('about')
})

module.exports = router
