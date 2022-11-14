const router = require('express').Router()
const Post = require("../models/post")
const jwt = require("jsonwebtoken")

router.get("/",verifyAuthorization,async(req,res)=>{
    try {
        const {user} = req
        console.log(user)
        let post = await Post.find({user:{$eq:user}})
        const posts = await Post.find()
        if(post.length===0){
            post = "NO POST ADDED"
        }

        res.json({
            status:"Success",
            userPost:post,
            AllPosts:posts
        })
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }
   
})
router.post("/",verifyAuthorization,async(req,res)=>{
    try {
        const {title,body,image} =req.body;
        console.log(req.body);
        console.log(req.user)
        const posts = await Post.create({
           title,
           image,
           body,
           user:req.user
        })
        res.json({
            status:"Success",
            posts:posts
        })
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }

})
router.put("/:postId",verifyAuthorization,async(req,res)=>{
    try {
        const {user} = req

        const verify = await Post.findOne({$and:[{user:{$eq:user}},{_id:{$eq:req.params.postId}}]})
        if(verify){
            const posts = await Post.findByIdAndUpdate({_id:req.params.postId},req.body)
            res.json({
                status:"Success",
                posts:posts
            })
        }
        res.sendStatus(404)
        
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }

})
router.delete("/:postId",verifyAuthorization,async(req,res)=>{
    try {
        const verify = await Post.findOne({$and:[{user:{$eq:user}},{_id:{$eq:req.params.postId}}]})
        if(verify){
            const posts = await Post.findByIdAndDelete({user:req.params.postId})
            res.json({
                status:"Success",
                posts:posts
            })
        }
        res.sendStatus(404)
       
    } catch (error) {
        res.status(400).json({
            status:"Failed",
            message:error.message
        })
    }

})

function verifyAuthorization  (req,res,next){
    const authHeader = req.headers["authorization"];
    const bearer = authHeader.split(" ")
    const token = bearer[1]
    
    if(token){
       
        jwt.verify(token,"secret",function(err,data){
            if(err){
                res.json({
                    message:err.message
                })
            }else{
                req.user = data.data
                next()
            }
            
        })
    }
    else{
        res.sendStatus(403)
    }
}

module.exports = router