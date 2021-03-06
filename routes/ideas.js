const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../helpers/auth')

// load model
const Idea = require('../models/Idea')
// validator
const validate = require('../models/Idea/validate')

/**
 ** @route   GET /
 *? @desc    Idea-list page
 *! @access  Protected
 */
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const ideas = await Idea.find({ author: req.user })

        res.render('ideas/index', { ideas })
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

/**
 ** @route   GET /add
 *? @desc    Add Idea Form page
 *! @access  Protected
 */
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add', { title: '', details: '' })
})

/**
 ** @route   GET /edit/:id
 *? @desc    Edit Idea Form page
 *! @access  Protected
 */
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params

        const { title, details, author } = await Idea.findById(id)

        if (!author.equals(req.user.id)) {
            req.flash('error', '---Not Authorized')
            res.redirect('/ideas')
        } else {
            res.render('ideas/add', { title, details, id })
        }
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

/**
 ** @route   POST /
 *? @desc    Add/Edit Idea process
 *! @access  Protected
 */
router.post('/', ensureAuthenticated, async (req, res) => {
    const { errors, isValid } = validate(req.body)

    const { title, details, id } = req.body

    // validate form data
    if (!isValid) {
        return res.render('ideas/add', { errors, title, details })
    }

    try {
        if (id) {
            const { author } = await Idea.findById(id).select('author')

            if (author.equals(req.user.id)) {
                await Idea.findByIdAndUpdate(id, {
                    $set: { title, details },
                })

                req.flash('info', 'Video idea updated')
                res.redirect('/ideas')
            } else {
                req.flash('error', 'Not Authorized')
                res.redirect('/ideas')
            }
        } else {
            await new Idea({ title, details, author: req.user }).save()

            req.flash('info', 'Video idea created')
            res.redirect('/ideas')
        }
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

/**
 ** @route   DELETE /:id
 *? @desc    Delete Idea Process
 *! @access  Protected
 */
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params

        const { author } = await Idea.findById(id).select('author')

        if (author.equals(req.user.id)) {
            await Idea.findByIdAndDelete(id)

            req.flash('info', 'Video idea deleted')
            res.redirect('/ideas')
        } else {
            req.flash('error', 'Not Authorized')
            res.redirect('/ideas')
        }
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

module.exports = router
