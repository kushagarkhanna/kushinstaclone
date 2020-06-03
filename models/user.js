const mongoose=require('mongoose')
const {ObjectId}= mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"http://res.cloudinary.com/kushagar/image/upload/v1591080197/rvwcgvob1tyh4l3ixz8y.jpg"
    },
    followers:[{type:ObjectId,ref:"user"}],
    
    following:[{type:ObjectId,ref:"user"}]
})
mongoose.model("user",userSchema)