const mongoose=require('mongoose')
const videoSchema=new mongoose.Schema({
    title:{
        type:String,
required:true
    },
    poster:{
        type:String,
        required:false
    },
    url:{
        type:String,
        required:true
    },
    playList:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PlayList',
        required:true
    }
})
const Video=mongoose.model('Video',videoSchema)
module.exports=Video
