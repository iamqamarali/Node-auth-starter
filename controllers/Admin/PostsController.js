const { checkSchema, validationResult, matchedData } = require('express-validator');
const UnprocessableEntityError = require('../../Errors/UnprocessableEntityError');
const Post = require('../../Models/Post')
const uuid = require('uuid')

const fs = require('fs');
const path = require('path');
const auth = require('../../helpers/auth');
const { public_path } = require('../../helpers/helpers')

module.exports = { 

    /**
     * Show Home Screen 
     */
    index : async (req, res) => {
        let page = 1;
        if(req.query.page && req.query.page > 1){
            page = req.query.page
        }
        page--;
        let perPage = 20
        let posts = await Post.find({})
                            .skip(page * perPage)
                            .limit(perPage)
                            .populate('author')
                            .sort({createdAt: -1})
                            .exec()

        posts= posts.map(o => o.toObject({virtuals: true}));
    
        res.render('admin/posts/index', { title: 'Posts', posts: posts })
    },


    /**
     * store method
     */
    async store(req, res, next){

        await checkSchema({
            title: {
                errorMessage: 'Title is required',
                isLength: {
                    errorMessage: 'Title should be at least 5 chars long',
                    options: { min: 5 }
                },
                escape: true
            },
            body: {
                errorMessage: 'Body is required',
                isLength: {
                    errorMessage: 'Body should be at least 5 chars long',
                    options: { min: 5 }
                }
            },
            tags:{
                errorMessage: 'Tags is required',
                escape: true
            }
        }).run(req);


        let result = validationResult(req)
        if(!result.isEmpty()){
            return next(new UnprocessableEntityError(null, result.array()));
        }

        // validate image 
        if(req.file){
            if(!req.file.mimetype.includes('image')){
                let errors = [{ 
                    field: 'image',
                    msg : 'You can only upload images'
                }]
                return next(new UnprocessableEntityError(null, errors));
            }    
        }
        
        /**
         * 
         * upload file
         */
        let filepath = ''
        let publicPath = ''
        if(req.file){
            filepath = '/uploads/' + uuid.v1() + path.extname(req.file.originalname);
            fullpath = public_path(filepath)

            try{
                fs.writeFileSync(fullpath, req.file.buffer);    
            }catch(e){
                console.log(e)
            }
        }

        // get data from request
        let { title, body, tags } = matchedData(req)
        let post = new Post({
            title: title,
            body: body,
            tags: tags.split(','),
            author: auth.user._id,
            image: filepath
        })
        post.save();
        res.redirect('/dashboard/posts')
    },

    /**
     * create method
    */
    create(req, res) {
        res.render('admin/posts/create', { title: 'Create Post' })
    }
    

}

