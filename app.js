const express = require('express')
const mongoose = require('mongoose')
// Middleware
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

// create app
const app = express()
const port = 5000

// set static folder
app.use(express.static('public'))

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// method-override middleware
app.use(methodOverride('_method'))
// express session midleware
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

app.use(flash())
// global vars middleware
app.use((req, res, next) => {
    res.locals.info = req.flash('info')
    next()
})

// mongoDB
mongoose
    .connect('mongodb://localhost/vidjot', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB connected...'))
    .catch((error) => console.log('MongoDB: error', error))

// setup view engine
app.set('view engine', 'pug')

// routes
app.use('/', require('./routes'))
app.use('/ideas', require('./routes/ideas'))

// fireup server
app.listen(port, () => console.log(`app is running on ${port}...`))
