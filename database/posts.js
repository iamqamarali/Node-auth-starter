const { faker } = require('@faker-js/faker')
const Post = require('../Models/Post')
const User = require('../Models/User')


const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

async function seedPosts (count = 50){

    
    for(let i = 0 ; i<count; i++){
        let user = await User.findOne().skip(random(0,20));

        let post = new Post({
            title : faker.lorem.lines(1),
            body : faker.lorem.paragraphs( random(3, 10) ),
            tags : faker.lorem.words( random(1, 5) ).split(' '),
            image: faker.image.imageUrl(640, 480, 'animals', true),
            author : user._id,            
            featured: faker.datatype.boolean(),
        })
    
        await post.save();
    }

    console.log("Posts seeded")
}

module.exports = seedPosts;

