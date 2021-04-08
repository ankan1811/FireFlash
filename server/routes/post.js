const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")


router.get('/allpost',requireLogin,(req,res)=>{//To fetch all the posts
    Post.find()
    .populate("postedBy","_id name") //populate(name of the property)We are only getting id of the user in posted by.
    //Using populate we will nget all the details of posted by i.e. all detils of the user who posted. we can merge the details of the post with the post id using populate.
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})//json response i.e. the prameter converted to a JSON string using json.stringify()method
    }).catch(err=>{
        console.log(err)
    })
    
})

router.get('/getsubpost',requireLogin,(req,res)=>{//getting all posts of users whom the user follows

    // if postedBy id is present in following array then only post will appear
    Post.find({postedBy:{$in:req.user.following}})//Each post has postedBy 
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{//requirelogin middleware is there...
    //You can only post when you have the token and signed in
    const {title,body,pic} = req.body 
    if(!title || !body || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined //Make sure that the password is not stored in the post in mongo database and hence not visible 
    const post = new Post({//Features of post
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{//save the post
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{ // like of a post updation
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}//pushing likes with only the id of user who is logged in
    },{
        new:true //Otherwise mongodb will give old records
    }).exec((err,result)=>{//executing query
        if(err){
            return res.status(422).json({error:err})//return error response as json
        }else{
            res.json(result)//
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{ // unlike of a post updation
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}//pull will remove the user from likes array(Array which contains tokens of all users who have liked)
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,//comment details
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")//We don't want just an id. We want name of user who posted. 
    .populate("postedBy","_id name")//so We will expand by populate(or else name will erase after making commwent)
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()//Removes the post
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router
