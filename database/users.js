const { faker } = require('@faker-js/faker')
const User = require('../Models/User')
const { Roles } = require('../Models/User')
const bcrypt = require('bcrypt');


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
            password: bcrypt.hashSync('password', 10),

            roles: [ [Roles.user, Roles.editor, Roles.admin][random(0,3)]   ],

        })
    
        await user.save();
    }


    // create a user with admin role
    User.findOne({email: 'iamqamarali1@gmail.com'}).then(user=>{
        if(!user){
            User.create({
                first_name: 'Qamar',
                last_name: 'Ali',
                password: bcrypt.hashSync('password', 10),
                email : 'iamqamarali1@gmail.com',
                avatar: faker.image.avatar(),
                bio: faker.lorem.paragraph(),
                phone: faker.phone.number('###-###-####'),
                roles: [Roles.user, Roles.editor, Roles.admin]
            })        
        }
    })

    console.log("Users seeded")
}

module.exports = seedUsers;

