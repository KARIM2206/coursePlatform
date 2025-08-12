let {User} = require("../models/userModels");
let jwt = require("jsonwebtoken");
let  errorHandler  = require("../utils/error");
let bcrypt = require("bcrypt");
const path=require('path')
const fs=require('fs')
const UAParser = require('ua-parser-js');
const UserSession = require("../models/userSessionModel");
const { default: mongoose } = require("mongoose");
// دالة محسنة لتحليل User-Agent
const parseUserAgent=(userAgent) => {
  let parseUserAgent = new UAParser(userAgent);
  let result = parseUserAgent.getResult();
  let deviceType = result.device.type ;
  deviceType=deviceType== "mobile" ? "Mobile" : deviceType === "tablet" ? "Tablet" : "Desktop";
  let browser=result.browser.name || "unknown";
  let os=result.os.name || "unknown";
  let deviceName = result.device.vendor || "unknown";
  return { deviceType, browser, os, deviceName };

}

  // const UserSession = require('../models/UserSession');

let signup = async (req, res, next) => {
  let { name, email, password , role='student'} = req.body;
  
  
  if (!name || !email || !password || !role) {
    return next(errorHandler("Please fill all the fields", 400));
  }
  if (password.length < 6) {
    return next(errorHandler("Password must be at least 6 characters", 400));
  }
  if (!email.includes("@")) {
    return next(errorHandler("Please enter a valid email", 400));
  }
  if (name.length < 3) {
    return next(errorHandler("name must be at least 3 characters", 400));
  }
  let passwordHash = await bcrypt.hash(password, 10);

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler("User already exists", 400));
    }
    if (role=='admin') {
        return next(errorHandler("You are not allowed  to perform this action", 403));
       }
  const rolesInSignup=['student','teacher',]
      if (!rolesInSignup.includes(role)) {
        return next(errorHandler("You are not allowed  role", 404));
      }
   
  
    let user = new User({
      name,
      email,
      password: passwordHash,
      role
    });
   
const token = jwt.sign(
      { id: user._id, password, email,role },
      process.env.JWT_SECRET, { expiresIn: "7d" }
      
    );
    user.save();
    res.status(201).json({
      message: "User created successfully",
     ok:true,
      token,
      user
    });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email.includes("@")) {
    return next(errorHandler("enter valid email", 400));
  }

  if (password.length < 6) {
    return next(errorHandler(" email or password is wrong", 400));
  }

  try {
    const user = await User.findOne({ email });

    
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return next(errorHandler(" email or password is wrong", 400));
    }

    const token = jwt.sign(
      { id: user.id, password, email,role:user.role },
      process.env.JWT_SECRET
    );
    // const cart=
    res.json({ token ,ok :true,data:user ,   message: "signin  successfully",
     ok:true,});
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const upload_avatar = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return next(errorHandler("User not found", 404));
  
      // if (user.avatar) {
      //   return next(errorHandler("You already added an avatar before", 400));
      // }
  
      if (!req.file) {
        return next(errorHandler("No image uploaded", 400));
      }
  
      // تأكد إن فولدر الحفظ موجود
     const fileDirName=path.join(__dirname,'../uploads/usersAvatar')  
     if(!fs.existsSync(fileDirName)){
        fs.mkdirSync(fileDirName);
     }
      // توليد اسم للملف وحفظه
    const fileName = Date.now() + path.extname(req.file.originalname);
const filePath = path.join(fileDirName, fileName); // <-- fix here
fs.writeFileSync(filePath, req.file.buffer);

  
      // تحديث بيانات المستخدم
      user.avatar = `uploads/usersAvatar/${fileName}`;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        avatar: user.avatar
      });
    } catch (error) {
      next(error);
    }
  };
  const updateAvatar = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return next(errorHandler("User not found", 404));
  
      if (!req.file) {
        return next(errorHandler("No image uploaded", 400));
      }
  
      // تأكد إن فولدر الحفظ موجود
     const fileDirName=path.join(__dirname,'../uploads/usersAvatar')  
     if(!fs.existsSync(fileDirName)){
        fs.mkdirSync(fileDirName);
     }
      // توليد اسم للملف وحفظه
    const fileName = Date.now() + path.extname(req.file.originalname);
const filePath = path.join(fileDirName, fileName); // <-- fix here
fs.writeFileSync(filePath, req.file.buffer);

  
      // تحديث بيانات المستخدم
      user.avatar = `uploads/usersAvatar/${fileName}`;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        avatar: user.avatar
      });
    } catch (error) {
      errorHandler(error, 500)
    }
  };
  const getUser=async(req,res,next)=>{
      try {
          const user=await User.findById(req.user.id)
          res.status(200).json({success:true,user})
      } catch (error) {
          return next(errorHandler(error,500))
      }
  }
  const updateUser=async(req,res,next)=>{
    
    try {
      const {name, email, password,role} = req.body;
      if (!name || !email || !password) {
        return next(errorHandler("Please fill all the fields", 400));
      }
      const user=await User.findById(req.user.id);
      if (!user) {
        return next(errorHandler("User not found", 404));
      }
      if (password.length < 6) {
        return next(errorHandler("Password must be at least 6 characters", 400));
      }
      if (!email.includes("@")) {
        return next(errorHandler("Please enter a valid email", 400));
      }
      if (name.length < 3) {
        return next(errorHandler("Name must be at least 3 characters", 400));
      }
      const passwordHash = await bcrypt.hash(password, 10);
  
      user.name = name;
      user.email = email;
      user.password = passwordHash;
      user.role = role || user.role; // Update role if provided, otherwise keep existing role
      if (role && role !== user.role) {
        const rolesInSignup = ['student', 'teacher'];
        if (!rolesInSignup.includes(role)) {
          return next(errorHandler("You are not allowed to change role", 404));
        }
      }
    const token = jwt.sign(
        { id: user._id, password, email, role: role },
        process.env.JWT_SECRET, { expiresIn: "7d" }
      );
      await user.save();
      res.status(200).json({
        message: "User updated successfully",
        ok: true,
        user,token})
    } catch (error) {
      return next(errorHandler(error, 500));
    }
  }




// تعديل دالة logSession
logSession = async (req, res,next) => {
  try {
    const userAgent = req.headers['user-agent'];
    const { deviceType, browser, os, deviceName } = parseUserAgent(userAgent);
    
    const sessionData = {
      userId: req.user.id,
      action: req.body.action,
      deviceType,
      browser,
      os,
      deviceName,
    };

    const newSession = await UserSession.create(sessionData);
    
    res.status(201).json({
      success: true,
      data: newSession
    });
  } catch (err) {
 return next(errorHandler(err, 500));
  }
};

// الحصول على إحصائيات الدخول/خروج
getSessionStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // إحصائيات اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyStats = await UserSession.aggregate([
    {
    $match: {
      userId: new mongoose.Types.ObjectId(userId),
      timestamp: { $gte: today }
    }
  },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // إحصائيات الأسبوع
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
const weeklyStats = await UserSession.aggregate([
  {
    $match: {
      userId:new mongoose.Types.ObjectId(userId),
      timestamp: { $gte: weekAgo }
    }
  },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // إحصائيات الأجهزة والمتصفحات
    const deviceStats = await UserSession.aggregate([
      {
        $match: { userId:new mongoose.Types.ObjectId (userId )}
      },
      {
        $group: {
          _id: {
            deviceType: '$deviceType',
            browser: '$browser',
            os: '$os',
            deviceName: '$deviceName'
          },

      
          count: { $sum: 1 }

        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        daily: dailyStats,
        weekly: weeklyStats,
        devices: deviceStats
      }
    });
  } catch (err) {
   return next(errorHandler(err, 500));
  }
};
module.exports = { signup, signin,upload_avatar,getUser ,updateAvatar,updateUser,logSession,getSessionStats};
