const PlayList = require("../models/playlistModel")
const Quiz= require("../models/quizModel")
const { get } = require("../routes/playlistRoute")
const errorHandler = require("../utils/error")
const sendCertificate = require("../utils/sendCertificate")


const createQuiz=async(req,res,next) =>{
    const {title}=req.body
    try {
        const {playlistId}=req.params
        const playlist=await PlayList.findById(playlistId)
     
        
        if(!playlist){
            return next(errorHandler("playlist not found",404)) 
        }
        const quiz=await Quiz.create({title,playList:playlist._id})
        quiz.save()
        playlist.quizzes.push(quiz._id)
       
        
        await playlist.save()
        res.status(200).json({success:true,quiz})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}

const getQuiz=async(req,res,next) =>{
    try {
        const {quizId}=req.params

       
        const quiz=await Quiz.findById(quizId)
     
        
        res.status(200).json({success:true,quiz:{quiz}})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}
const getAllQuizsInPlaylist=async(req,res,next) =>{
    try {
        const {playlistId}=req.params
        const playlist=await PlayList.findById(playlistId)
console.log("playlist", playlist);

        if(!playlist){
            return next(errorHandler("playlist not found",404)) 
        }
        const quiz=await Quiz.find({playList:playlist._id})
     console.log("qiuz", quiz);
     
        res.status(200).json({success:true,quiz})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}


const deleteQuiz=async(req,res,next) =>{
    try {
        const {quizId}=req.params
     
        const quiz=await Quiz.findByIdAndDelete(quizId)
           if(!quiz){
            return next(errorHandler('quiz not found',404))
           }
        res.status(200).json({success:true,massage:"quiz deleted Successfully"})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}
const updateQuiz=async(req,res,next) =>{
    const {title}=req.body
    try {
        const {quizId}=req.params
    
        const quiz=await Quiz.findById(quizId)
        if(!quiz){
            return next(errorHandler("quiz not found",404)) 
        }
   
        if(title!==undefined)quiz.title=title
        res.status(200).json({success:true,quiz})
    } catch (error) {
        
    }
}






module.exports={createQuiz,getQuiz,deleteQuiz,updateQuiz,getAllQuizsInPlaylist}