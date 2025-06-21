// const {Quiz} = require("../models/quizModel")

const Question = require("../models/questionModel")
const Quiz = require("../models/quizModel")
const errorHandler = require("../utils/error")



const createQuizQestion=async(req,res,next) =>{
  
    try {
         const {quizId}=req.params
    const {questionText,options,correctAnswer}=req.body 
    const quiz=await Quiz.findOne({_id:quizId})
    if(!quiz){
        return next(errorHandler("quiz not found",404))
    }
    if(!questionText || !options || !correctAnswer){
        return next(errorHandler("all fields are required",400))
    }
    const questionData={questionText,options,correctAnswer,quiz:quiz._id}
      const question = await Question.create(questionData)
      question.save()
    res.status(200).json({ok:true,question})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}

const getQestionInQuiz=async(req,res,next) =>{
    try {
         const {questionId}=req.params 
         
        
         const question=await Question.findById(questionId)
         if (!question) {
            return res.status(404).json({ message: 'Question not found in quiz' });
          }
         res.status(200).json({success:true,question})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}
const getAllQestionsInQuiz=async(req,res,next) =>{
    try {
         const {quizId}=req.params 
         const skip=parseInt(req.query.skip)||0
         const limit=parseInt(req.query.limit)||10
         const quiz=await Quiz.findById(quizId)
         if (!quiz) {
             return next(errorHandler("quiz not found", 404));  
         }
         const questions=await Question.find({quiz:quizId}).skip(skip).limit(limit)
         res.status(200).json({success:true,questions})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}
const updateQestionInQuiz=async(req,res,next) =>{
    try {
         const {questionId}=req.params 
         const {questionText,options,correctAnswer}=req.body
      
        //  if (!quiz) {
        //      return next(errorHandler("quiz not found", 404));  
        //  }
         const question=await Question.findByIdAndUpdate(questionId,
          {$set:{questionText,options,correctAnswer}},{new:true})
    
         
         if (!question) {
            return res.status(404).json({ message: 'Question not found in quiz' });
          }
      
         await question.save()

         res.status(200).json({success:true,question})
    } catch (error) {
        return next(errorHandler(error.massage,500))
    }



}
 const deleteQestionInQuiz = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByIdAndDelete(questionId);

    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
module.exports={createQuizQestion,getQestionInQuiz,updateQestionInQuiz,deleteQestionInQuiz,getAllQestionsInQuiz}