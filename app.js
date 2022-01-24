// Hash md5 is not so good for passwords so we use salting
// password + random salt convert to hash store salt and hash in db
// more secure, repeat the step a number of times - bcrypt

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/userDB');
const saltRounds = 10;

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
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets')
            }
        }); 
    });
});

app.post('/login', (req, res) => {
    const email = req.body.username;

    User.findOne({email: email}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                if (err) {
                    console.log(err); 
                } else {
                    if (result && foundUser) {
                        res.render('secrets');
                    } else {
                        console.log("Not found");
                    }
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});