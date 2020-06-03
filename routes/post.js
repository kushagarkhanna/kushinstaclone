const express = require('express')
const router =express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const post =mongoose.model("post")

router.get('/allpost',requireLogin,(req,res)=>{
    post.find()
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
    post.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title, body, pic}=req.body
    if(!title || !body || !pic){
        res.status(401).json({err:"please fill all fields"})
    }
    req.user.password=undefined
    const post1= new post({
        title,
        body,
        photo:pic,
        postedby:req.user,
    })
    post1.save()
    .then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    post.find({postedby:req.user._id})
    .populate("postedby","_id name")
    .then(posts=>{
       
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postedid,{
        $push:{likes:req.user._id}
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

router.put('/unlike',requireLogin,(req,res)=>{
    post.findByIdAndUpdate(req.body.postedid,{
        $pull:{likes:req.user._id}
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
    const comment={
        text:req.body.text,
        postedby:req.user._id
    }
    post.findByIdAndUpdate(req.body.postedid,{
        $push:{comments:comment}
    },{
        new:true
    
    })
    .populate("comments.postedby","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postedid',requireLogin,(req,res)=>{
    post.findOne({_id:req.params.postedid})
    .populate("postedby","_id")
    .exec((err,post)=>{
        if(err || !post){
        return res.status(422).json({error:err})
    }
    if(post.postedby._id.toString() ==req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
    }
    })
})

module.exports=router