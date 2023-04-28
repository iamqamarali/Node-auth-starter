const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const MainRouter = require('./routes/_main')
const ErrorsHandler = require('./Errors/_kernal')

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const ejs = require('ejs');
const moment = require('moment')

//require('dotenv').config()


// connect mongoose to mongodb
const dbUrl = 'mongodb://127.0.0.1:27017/node-blog'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl, options)
        .then(function(){ console.log("mongodb connected") })
        .catch(function(){ console.log("mongodb connection failed") })

        
// make mongo session store
var MongoSessionStore = new MongoDBStore({
    uri: dbUrl,
    collection: 'my_sessions'
});
// Catch errors
MongoSessionStore.on('error', function(error) {
    console.log("Session storage Store error",error);
});
    


const app = express()


/**
 * setup ejs
 */
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', './views');
// app template engine variables
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});


/**
 * 
 * add middlewares
 * 
 */
  
let cookieSessionSecret = 'this is my secret for cookie parsing';
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(cookieSessionSecret))
app.use(session({
    store: MongoSessionStore,
    secret: cookieSessionSecret,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3 // 1 week
    },
    resave: true,
    saveUninitialized: true
}))
app.use(flash());


//app.use(multer().single('photo'))

/**
 * 
 * setup router
 */
app.use(MainRouter)


/**
 * error handler
 */
app.use(ErrorsHandler)


/**
 * start server
 */
const PORT = 3000 || process.env.PORT
app.listen(PORT, () => {
    console.log('Server is running at port '+ PORT)
})