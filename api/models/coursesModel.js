const mongoose = require('mongoose')

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
required:true
    },
    price:{
        type:Number,
        required:true

    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
   
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false
    },
    teacherDetails:{
        type:String,
        required:false
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    slug:{
        type:Array,
        required:true,
        unique:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
   rating: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 }
  }
],subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

})


const Course=mongoose.model('Course',courseSchema)
module.exports=Course