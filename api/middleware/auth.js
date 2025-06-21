const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");
const isAuth=(req,res,next) =>{
    const authHeader = req.headers.authorization ||req.headers.Authorization ;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(errorHandler('unAuthorized', 401));
    } 
    const token = req.headers.authorization.split(" ")[1] ||req.headers.Authorization.split(" ")[1];
    try {
           if(!token){
        return next(errorHandler('unAuthorized', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    

    
    next();
    } catch (error) {
        console.log("is auth catch error", error);
        
        return next(errorHandler(error, 500));
    }
   
 
}
module.exports=isAuth