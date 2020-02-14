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
        const ideas = await Idea.find()

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
 ** @route   GET /add
 *? @desc    Edit Idea Form page
 *! @access  Protected
 */
router.get('/edit/:_id', ensureAuthenticated, async (req, res) => {
    try {
        const { _id } = req.params

        const { title, details } = await Idea.findById(_id)

        res.render('ideas/add', { title, details, _id })
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

/**
 ** @route   DELETE /:_id
 *? @desc    Delete Idea Process
 *! @access  Protected
 */
router.delete('/:_id', ensureAuthenticated, async (req, res) => {
    try {
        const { _id } = req.params

        await Idea.findByIdAndDelete(_id)

        req.flash('info', 'Video idea deleted')
        res.redirect('/ideas')
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

    const { title, details, _id } = req.body

    // validate form data
    if (!isValid) {
        return res.render('ideas/add', { errors, title, details })
    }

    try {
        if (_id) {
            await Idea.findByIdAndUpdate(_id, {
                $set: { title, details },
            })

            req.flash('info', 'Video idea updated')
            res.redirect('/ideas')
        } else {
            await new Idea({ title, details }).save()

            req.flash('info', 'Video idea created')
            res.redirect('/ideas')
        }
    } catch (error) {
        console.log('error', error)
        res.render('error', { error: 'Server error' })
    }
})

module.exports = router
