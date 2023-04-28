const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    avatar: String,
    bio: String,
    phone: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: [String],
}, {
    timestamps: true,
});

/**
 * Roles Methods
 */
let Roles = {
    user : 'user',
    admin : 'admin',
    superadmin : 'superadmin',    
    editor : 'editor'
}
userSchema.methods.hasRole = function(roles){
    if(Array.isArray(roles)) 
        return this.hasAnyRole(roles);
    
    return this.roles.includes(roles);
}

userSchema.methods.hasAnyRole = function(roles){
    return roles.some(role => this.roles.includes(role));
}




// accessors
userSchema.virtual('name').get(function() {
    return this.first_name + ' ' + this.last_name;
})


/**
 * pre and post hooks for model
 */
userSchema.post('init', function(doc) {
    
});

userSchema.pre('save', function(next) {
    if(!this.roles || this.roles.length == 0){
        this.roles.push(Roles.user);
    }

    next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
module.exports.Roles = Roles;