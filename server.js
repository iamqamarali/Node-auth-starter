require('dotenv').config()

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

const CheckDatabaseConnection = require('./middlewares/global/CheckDatabaseConnection')



// connect mongoose to mongodb
const dbUrl = process.env.DB_URL
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl, options)
        .then(function(){ console.log("mongodb connected") })
        .catch(function(){ console.log("mongodb connection failed"); })

        
// make mongo session store
var MongoSessionStore = new MongoDBStore({
    uri: dbUrl,
    collection: 'my_sessions'
});
// Catch errors
MongoSessionStore.on('error', function(error) {
    console.log("Session storage Store error",error);
});
MongoSessionStore.on('connected', function() {
})    


const app = express()



/**
 * setup ejs
 */
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('views', __dirname + '/views');
// app template engine variables
app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});


// add essential middlewares
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// import global middlewares
app.use(CheckDatabaseConnection)


/**
 * add more middlewares
 */  
app.use(cookieParser(process.env.COOKIE_SESSION_SECRET))
app.use(session({
    store: MongoSessionStore,
    secret: process.env.COOKIE_SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3 // 1 week
    },
    resave: true,
    saveUninitialized: true
}))
app.use(flash());



// * setup router
app.use(MainRouter)

// * error handler
app.use(ErrorsHandler)


/**
 * start server
 */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server is running at port '+ PORT)
})


module.exports = app;