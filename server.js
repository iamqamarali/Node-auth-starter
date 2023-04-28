const express = require('express')
const HandleBars = require('express-handlebars')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const MainRouter = require('./routes/_main')
const ErrorsHandler = require('./Errors/_kernal')

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');



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
 * setup handlebars
 */
const hbs = HandleBars.create({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: './views/partials',
    partialsDir: [
        './views/partials',
        {
            dir: './views/admin/partials',
            namespace: 'admin', 
        }

    ],
    helpers: {
        times: function(n, block) {
            var accum = '';
            for(var i = 0; i < n; ++i){
                accum += block.fn(i);
            }
            return accum;
        },
        add: (...args)=>{
            args.pop();
            return args.reduce((a, b)=> a + b)
        },
        substring : (str, start, end) => {
            return str.substring(start, end)
        },
        formatDate: (date) => {
            let d = new Date(date)
            return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
                    d.getHours() + ":" + d.getMinutes(); 
        },
        ucwords : (str) => {
            return str.replace(/\b\w/g, l => l.toUpperCase());
        },

        arrayIncludes: (arr, val, output1, output2) => {
            if(!arr){
                return output2
            }
            if(arr.includes(val)){
                return output1
            }
            return output2
        },
        when : (operand_1, operator, operand_2, options) =>{
            console.log
            var operators = {
             'eq': function(l,r) { return l == r; },
             'noteq': function(l,r) { return l != r; },
             'gt': function(l,r) { return Number(l) > Number(r); },
             'or': function(l,r) { return l || r; },
             'and': function(l,r) { return l && r; },
             '%': function(l,r) { return (l % r) === 0; }
            }
            result = operators[operator](operand_1,operand_2);
          
            if (result) return options.fn(this);
            else  return options.inverse(this);
        }
    }
})

// set Express View Engine
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');


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