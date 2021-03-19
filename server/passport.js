const LocalStrategy = require('passport-local');
const User = require('../model/User.js');

module.exports = (passport) => {
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }).then(user => {
            if (!user) {
                return done(null, false, { message: 'Не постоји налог са тим корисничким именом.' });
            } else {
                if (user.password != password) {
                    return done(null, false, { message: 'Шифра је нетачна.' });
                } else {
                    return done(null, user);
                }
            }
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}