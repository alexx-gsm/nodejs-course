const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
// Middleware
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// create app
const app = express()
const port = 5000

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

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
// Passport config
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
// global vars middleware
app.use((req, res, next) => {
    res.locals.info = req.flash('info').join()
    res.locals.error = req.flash('error').join()
    res.locals.email = req.flash('email').join()
    res.locals.user = req.user || null
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
app.use('/users', require('./routes/users'))

// fireup server
app.listen(port, () => console.log(`app is running on ${port}...`))
