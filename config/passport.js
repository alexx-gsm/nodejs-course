const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email })

                if (!user) {
                    return done(null, false)
                }

                const isMatch = await bcrypt.compare(password, user.hash)

                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            } catch (error) {
                done(error)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await User.findById(_id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}
