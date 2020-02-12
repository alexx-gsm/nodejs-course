const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// create app
const app = express()
const port = 5000

// static
app.use(express.static('public'))

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// method override middleware
app.use(methodOverride('_method'))

// mongoDB
mongoose
    .connect('mongodb://localhost/vidjot', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((error) => console.log('MongoDB: error', error))

// load models
require('./models/Idea')
const Idea = mongoose.model('ideas')

// setup view engine
app.set('view engine', 'pug')

// routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello from Pug view!' })
})
// About page
app.get('/about', (req, res) => {
    res.render('about')
})
// Get Listed Ideas
app.get('/ideas', async (req, res) => {
    try {
        const ideas = await Idea.find()
        res.render('ideas/index', { ideas })
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})
// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add', { title: '', details: '' })
})
// Edit Idea
app.get('/ideas/edit/:_id', async (req, res) => {
    try {
        const { _id } = req.params
        const { title, details } = await Idea.findById(_id)

        res.render('ideas/add', { title, details, _id })
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})
// Delete Idea Process
app.delete('/ideas/:_id', async (req, res) => {
    try {
        const { _id } = req.params

        await Idea.findByIdAndDelete(_id)

        res.redirect('/ideas')
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})
// Process Form
app.post('/ideas', (req, res) => {
    const { title, details, _id } = req.body

    const errors = {}

    if (!title) {
        errors.title = 'Please add a title'
    }

    if (!details) {
        errors.details = 'Please add some details'
    }

    if (Object.keys(errors).length > 0) {
        res.render('ideas/add', { errors, title, details })
    } else {
        if (_id) {
            Idea.findByIdAndUpdate(_id, {
                $set: { title, details },
            })
                .then(() => res.redirect('/ideas'))
                .catch((error) => {
                    console.log('error', error)
                    res.render('error', { error: 'Server error' })
                })
        } else {
            new Idea({ title, details })
                .save()
                .then(() => res.redirect('/ideas'))
                .catch((error) => {
                    console.log('error', error)
                    res.render('error', { error: 'Server error' })
                })
        }
    }
})

// fireup server
app.listen(port, () => console.log(`app is running on ${port}...`))
