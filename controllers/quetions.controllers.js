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
    const question={questionText,options,correctAnswer}
    quiz.questions.push(question)
    await quiz.save()
    res.status(200).json({success:true,quiz})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}

const getQestionInQuiz=async(req,res,next) =>{
    try {
         const {quizId,questionId}=req.params 
         const quiz=await Quiz.findById(quizId)
         if (!quiz) {
             return next(errorHandler("quiz not found", 404));  
         }
         const question=quiz.questions.id(questionId)
         if (!question) {
            return res.status(404).json({ message: 'Question not found in quiz' });
          }
         res.status(200).json({success:true,question})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}
const updateQestionInQuiz=async(req,res,next) =>{
    try {
         const {quizId,questionId}=req.params 
         const {questionText,options,correctAnswer}=req.body
         const quiz=await Quiz.findById(quizId)
         if (!quiz) {
             return next(errorHandler("quiz not found", 404));  
         }
         const question=quiz.questions.id(questionId)
    
         
         if (!question) {
            return res.status(404).json({ message: 'Question not found in quiz' });
          }
         if(questionText!==undefined)question.questionText=questionText
         if(options!==undefined)question.options=options
         if(correctAnswer!==undefined)question.correctAnswer=correctAnswer
         await quiz.save()

         res.status(200).json({success:true,quiz})
    } catch (error) {
        return next(errorHandler(error,500))
    }



}
  const deleteQestionInQuiz=async(req,res,next) =>{
    try {
         const {quizId,questionId}=req.params 
         const quiz=await Quiz.findById(quizId)
         if (!quiz) {
             return next(errorHandler("quiz not found", 404));  
         }
         const question=quiz.questions.id(questionId)
         const questionIndex=quiz.questions.indexOf(question)
      
         
         if (!question) {
            return res.status(404).json({ message: 'Question not found in quiz' });
          }

        
          
       quiz.questions.splice(questionIndex,1)
         await quiz.save()
         res.status(200).json({success:true,quiz})
    } catch (error) {
        return next(errorHandler(error,500))
    }
}
module.exports={createQuizQestion,getQestionInQuiz,updateQestionInQuiz,deleteQestionInQuiz}