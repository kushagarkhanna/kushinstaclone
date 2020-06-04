const express = require('express')
const router =express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const post =mongoose.model("post")
const user =mongoose.model("user")

router.get('/user/:id',requireLogin,(req,res)=>{
    user.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        post.find({postedby:req.params.id})
        .populate("postedby","_id name")
        //exec((err,posts)=>{
            //if(err){
          //      return res.status(422).json({error:err})
          //  }
          .then(posts=>{
       
            res.json({user,posts})
        })
           // res.json({user,posts})
       // })
    }).catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    user.findByIdAndUpdate(req.body.followid,{
        $push:{followers:req.user._id}
    },{
            new:true
        },(err,result)=>{
            if(err){
                res.status(422).json({error:err})
            }
            user.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followid}
            },{
                new:true
            }
            ).select("-password")
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        }
    )
})

router.put('/unfollow',requireLogin,(req,res)=>{
    user.findByIdAndUpdate(req.body.unfollowid,{
        $pull:{followers:req.user._id}
    },{
            new:true
        },(err,result)=>{
            if(err){
                res.status(422).json({error:err})
            }
            user.findByIdAndUpdate(req.user._id,{
                $pull:{following:req.body.unfollowid}
            },{
                new:true
            }
            ).select("-password")
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        }
    )
})

router.put('/updatepic',requireLogin,(req,res)=>{
    user.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err){
                res.status(422).json({error:"pic cannot posted"})
            }
            res.json(result)
        }
    )
})

router.post('/searchuser',(req,res)=>{
    let userPattern= new RegExp("^"+req.body.query1)
    user.find({email:{$regex:userPattern}})
    .then(result=>{
        res.json({result})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router