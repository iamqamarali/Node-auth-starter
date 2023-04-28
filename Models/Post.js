const Mongoose = require('mongoose')
const { CommentSchema } = require('./Comment')

const PostSchema = new Mongoose.Schema({
    title:{
        type: String,
        required: true,        
    },
    body:{
        type: String,
        required: true,
    },
    tags:[String],
    image: String,
    featured: Boolean,


    author : {
        type: Mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    comments: [CommentSchema],
    likes: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]

}, {
    timestamps: true,
});


module.exports = Mongoose.model('Post', PostSchema);
