const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const router = require('./router.js');
const passport = require('passport');

// configuration
require('dotenv').config();
require('./passport.js')(passport);

const app = express();

// ejs setup
app.set('view-engine', 'ejs');

// body-parser
app.use(express.urlencoded({ extended: false }));

// flash setup
app.use(session({
    secret: 'dega',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.login_error = req.flash('error');
    next();
})

// check if user is authenticated
app.use((req, res, next) => {
    if (req.url == '/login' || req.url == '/register') {
        if (req.isAuthenticated()) return res.redirect('/');
        else return next();
    }

    if (req.isAuthenticated()) return next();

    res.redirect('/login');
})

// router
app.use(router);

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("Повезана база података ..."))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Цепа се јако на порту: ${3000} ...`));