require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const port = 3000;
const md5 = require('md5');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({ 
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render('secrets')
        }
    });
});

app.post('/login', (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email: email}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser && foundUser.password === md5(password)) {
                res.render('secrets');
            } else {
                console.log("Not found");
            }
        }
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});