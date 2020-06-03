const express = require('express')
const router =express.Router()
const mongoose=require('mongoose')
const user=mongoose.model("user")
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const {JWT_SECRET}=require('../config/keys')
const requireLogin= require('../middleware/requireLogin')
//const nodemailer= require('nodemailer')
//const sendgridTransport= require('nodemailer-sendgrid-transport')

// const transport=nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:""
//     }
// }))

router.post('/signup',(req,res)=>{
   const{name, email, password,pic}= req.body
   if(!email || !password || !name){
      return res.status(422).json({error:"please fill all the fields"})
   }
   user.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
           return res.status(422).json({err:"user already exists"})
       }
       bcrypt.hash(password,12)
       .then(hashedpassword=>{
        const user1 =new user({
            email,
            password:hashedpassword,
            name,
            pic
        })
        user1.save()
        .then(user1=>{
            // transporter.sendEmail({
            //     to:user.email,
            //     from:"no-reply@insta.com",
            //     subject:"signup success",
            //     html:"<h1>Welcome to instaagram</h1>"
            // })
            res.json({message:"saved successfully"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
       })
      
})

router.post('/signin',(req,res)=>{
    const {email, password}=req.body
    if(!email || !password){
        return res.status(422).json({err:"please add email or password"})
    }

    user.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
           return res.status(422).json({err:"invalid email or password"})
        }
    bcrypt.compare(password,savedUser.password)
    .then((domatch)=>{
        if(domatch){
            //res.json({message:"successfully signed in"})
            const token= jwt.sign({_id:savedUser._id},JWT_SECRET)
            const {_id,name,email,followers,following,pic}=savedUser
            res.json({token:token,user:{_id,name,email,followers,following,pic}})
        }
        else{
            return res.status(422).json({err:"invalid email or password"})
        }
    })
    .catch((err)=>{
        console.log(err)
    })
    })

})

module.exports=router