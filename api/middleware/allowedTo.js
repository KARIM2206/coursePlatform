const errorHandler = require("../utils/error")

const allowedTo=(...roles)=>{
    return(req,res,next)=>{
       
        
        if(!roles.includes(req.user.role)){
            return next(errorHandler('You are not authorized to perform this action',403))
        }
      
        next()
    }
}
module.exports=allowedTo