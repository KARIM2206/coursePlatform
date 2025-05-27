const jwt =require('jsonwebtoken')
const errorHandler = require("../utils/error");
const courseAuth=(req,res,next)=>{
    try {
        const token = req.headers['course-token'].split(" ")[1] //||req.headers.Authorization.split(" ")[1];
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.course = decoded;
        next();
    } catch (error) {
        console.log("is auth catch error", error);
        return next(errorHandler(error, 500));
    }
}
module.exports=courseAuth