const Mongoose = require('mongoose');

const CommentSchema = new Mongoose.Schema({
    body:{
        type: String,
        required: true,
    },
    author : [{
        type: Mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true,
});

const Comment = Mongoose.model('Comment', CommentSchema);


module.exports = Comment;
module.exports.CommentSchema = CommentSchema;