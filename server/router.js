const express = require('express');
const passport = require('passport');
const User = require('../model/User.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.ejs');
})

router.get('/register', (req, res) => {
    res.render('register.ejs');
})

router.get('/login', (req, res) => {
    res.render('login.ejs');
})

router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;
    const errors = [];

    if (username.length > 20) errors.push('Корисничко име не може бити дужe од 20 карактера.');
    if (password.length < 6) errors.push('Шифра не може бити краћа од 6 карактера.');
    if (password != password2) errors.push('Шифре нису исте.');

    await User.findOne({ username: username }).then(user => {
        if (user) errors.push(`Корисничко име ${username} је већ заузето.`);
    })

    if (errors.length > 0) {
        res.render('register.ejs', { errors, username, password, password2 });
    } else {
        const newUser = new User({ username, password });
        await newUser.save();

        req.flash('success_msg', 'Налог је успешно направљен.');

        res.redirect('/login')
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})

router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Успешно сте се одјавили.')
    res.redirect('/login');
})

module.exports = router;