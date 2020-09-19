var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));
app.use(flash()); 
app.use(function(req, res, next){
    res.locals.error = req.flash("error_message");
    next();
 });

var Users = [{
    "username": "admin",
    "email":"admin@cmpe273.com",
    "password": "admin"
}];

app.get('/', function (req, res) {
    if (req.session.user) {
        res.redirect('/home')
    } else
    res.render('login')
});

app.get('/login', function (req, res){
    if (req.session.user) {
        res.redirect('/home')
    } else {
        res.redirect('/')
    }
})

app.post('/login', function (req, res) {
    if (req.session.user) {
        res.redirect('/home')
    } else {
        var userSuccess = Users.filter(obj => {
            if (obj.username === req.body.username){
                return obj
            } else if (obj.email === req.body.username) {
                return obj
            }
          })
        if (Object.entries(userSuccess).length !== 0) {
            userSuccess.filter(user => {
                if (user.username === req.body.username && user.password === req.body.password) {
                    req.session.user = user;
                    res.redirect('/home')
                }
                else if (user.email === req.body.username && user.password === req.body.password) {
                    req.session.user = user;
                    res.redirect('/home')
                } else {
                    req.flash('error_message', 'Please enter a valid username/email and password')
                    setTimeout(function(){ res.redirect('/#tologin') }, 500);
                }
            }) }
                else {
                    req.flash('error_message', 'Please enter a valid username/email and password')
                    setTimeout(function(){ res.redirect('/#tologin') }, 500);
                
                }
    }

});

app.post('/signup', function(req, res){
    user = req.body.Users
    if (user.password !== req.body.confirmpassword) {
        req.flash('error_message', 'Password does not match')
        setTimeout(function(){ res.redirect('/#toregister')}, 50)
    } else {
        var usercred = req.body.Users.username
        var usercred2 = req.body.Users.email
        function hasValue(obj, key, value) {
            return obj.hasOwnProperty(key) && obj[key] === value;
        }
        bool1 = (Users.some(function(user) { return hasValue(user, "username", usercred.toString()); }));
        bool2 = (Users.some(function(user) { return hasValue(user, "email", usercred2.toString()); }));
        if (bool1 || bool2 == true) {
            req.flash('error_message', 'User/Email already exists.')
            res.redirect('/#toregister')
        } else {
            Users.push(user)
            res.redirect('/login')
        }

    }
})

app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('home')
    }
});

app.get('/maps', function (req, res) {
    if (!req.session.user) {
        res.redirect('/')
    } else {
    res.render('maps')
    }
});

app.get('/logout', function(req, res){
    if (!req.session.user) {
        res.redirect('/')
    } 
})

app.post('/logout', function (req, res){
    if (!req.session.user) {
        res.redirect('/')
    } else {
    res.clearCookie('duoshuo_token');
    req.session.destroy();
    res.redirect('/')
    }
})

var server = app.listen(8000, function () {
    console.log("Server listening on port 8000");
});