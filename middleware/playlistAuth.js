const errorHandler = require("../utils/error");
const jwt=require('jsonwebtoken')
const playlistAuth=(req,res,next) =>{
    try {
        const token = req.headers['playlist-token'].split(" ")[1] //||req.headers.Authorization.split(" ")[1];
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.playlist = decoded;
        console.log(req.playlist.id);
        
        next();
    } catch (error) {
        console.log("is auth catch error", error);
        return next(errorHandler(error, 500));
    }
}
module.exports=playlistAuth