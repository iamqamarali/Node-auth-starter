const { faker } = require('@faker-js/faker')
const User = require('../Models/User')
const { Roles } = require('../Models/User')


const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

async function seedUsers (count = 50){
    
    for(let i = 0 ; i<count; i++){
        let user = new User({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            password: faker.internet.password(),
            avatar: faker.image.avatar(),
            bio: faker.lorem.paragraph(),
            phone: faker.phone.number('###-###-####'),

            email: faker.internet.email(),
            password: faker.internet.password(),

            roles: [ [Roles.user, Roles.editor, Roles.admin][random(0,3)]   ],

        })
    
        await user.save();
    }




    console.log("Users seeded")
}

module.exports = seedUsers;

