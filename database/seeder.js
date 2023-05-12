const mongoose = require('mongoose');
const seedPosts = require('./posts');
const seedUsers = require('./users');

const dbUrl = process.env.DB_URL
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}
mongoose.set('strictQuery', true)
mongoose.connect(dbUrl, options)
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


