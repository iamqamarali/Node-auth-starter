const Post = require('../Models/Post')
const PageNotFoundError = require('../Errors/PageNotFoundError')

const PagesController = {

    /**
     *
     * Show Home Screen 
     */
    home : async (req, res) => {
        let posts = await Post.find({featured : {$ne: true} })
                            .limit(9)
                            .sort({createdAt : -1})
                            .populate('author')

        let featured = await Post.find({featured : true}).sort({createdAt : -1})
                                .limit(5)
                                .populate('author')


        res.render('home', { 
            title: 'Home',
            posts : posts.map(post => post.toJSON({virtuals : true})),
            featured : featured.map(post => post.toJSON({virtuals : true}))
        })
    },


    /**
     * 
     * allPosts
     */
    async allPosts(req, res){
        let page = 1;
        if(req.query.page && req.query.page > 1){
            page = req.query.page
        }
        page--;
        let perPage = 15;

        let posts = await Post.find({featured : {$ne: true} })
                            .skip(page * perPage)
                            .limit(perPage)
                            .sort({createdAt : -1})
                            .populate('author')


        page++;
        let prevPage = (page - 1) > 0 ? page - 1 : 0

        res.render('posts/index', { 
            title: 'All Posts',
            posts : posts.map(post => post.toJSON({virtuals : true})),
            pagination : {
                current_page  : page ,
                next_page : page+1,
                prev_page : prevPage,
                next_page_url : `/posts?page=${page+1}`,
                prev_page_url : `/posts?page=${prevPage}`,
            }
        })
    },

    /**
     * 
     * singlePost
     */
    async singlePost(req, res, next){
        let post_id = req.params.post;
        try{
            let post = await Post.findById(post_id).populate('author')
            res.render('posts/show', {
                title : post.title,
                post : post.toJSON({virtuals : true})
            })    
        }catch(e){
            next(new PageNotFoundError());
        }
    }


}


module.exports = PagesController