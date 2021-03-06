//Node-modules
var express= require('express');
var mongoose= require('mongoose');
var reload= require('reload');
var passport= require('passport');
var flash= require('connect-flash');
var cookieParser= require('cookie-parser');
var session= require('express-session');
var multer= require('multer');
var morgan= require('morgan');
var bp= require('body-parser');
var nodemailer= require('nodemailer');
var expressValidator= require('express-validator');
var app= express();

//Database, Routes, multer & nodemailer Files
var datas= require('./Database/data.js');
var routes= require('./Routes/route.js');
var multer= require('./Multer/multer.js');
var nodemailer= require('./Nodemailer/nodemailer.js');

//mongoose connections
mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://admin:admin1@ds211143.mlab.com:11143/datas", { useNewUrlParser: true });
    
//middleware 
app.use(expressValidator());
//app.use(morgan('dev'));
app.use(flash());
app.use(bp.json());
app.use(bp.urlencoded({extended : true}));
app.use(cookieParser());
app.use(session({
    secret: "secure",
    resave: true,
    saveUninitialized: true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done){
   done(null, user.id); 
});

passport.deserializeUser(function(id, done){
   datas.findById(id, function(err, user){
       done(err, user);
   });
});

//ejs Templates
app.set('view engine', './views');

//Static file
app.use(express.static('public'));

// Reload code here 
reload(app);

//Routes
app.use('/', routes);
app.use('/', multer);
app.use('/', nodemailer);  

//Listner
app.listen(process.env.PORT || 1223, console.log("http://localhost:1223"));