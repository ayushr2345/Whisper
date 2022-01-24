require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption');
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({ 
    email: String,
    password: String
});

// Level 1 was plain string

// Level 2- mongoose-encryption (encrypts the database with some key)
/*
const secret = "Thisissecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});
*/

// But the secret key can be seen by anyone
// hence we use dotenv to hide it in other file
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

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
        password: req.body.password
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
            if (foundUser && foundUser.password === password) {
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