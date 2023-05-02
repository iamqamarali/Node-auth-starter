const mongoose = require('mongoose');
const seedPosts = require('./posts');
const seedUsers = require('./users');

const url = 'mongodb://127.0.0.1:27017/node-blog'
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.set('strictQuery', true)
mongoose.connect(url, options)
        .then(function(){ console.log("mongodb connected") })
        .catch(function(){ console.log("mongodb connection failed") })



async function seedDatabase(){
    await seedUsers(50);
    await seedPosts(500)
}


// close mongodb connection after seeding
seedDatabase().then(()=>{
    mongoose.connection.close()
})


