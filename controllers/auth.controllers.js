let {User} = require("../models/userModels");
let jwt = require("jsonwebtoken");
let  errorHandler  = require("../utils/error");
let bcrypt = require("bcrypt");
const path=require('path')
const fs=require('fs')
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
      token
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
    res.json({ token });
  } catch (error) {
    return next(errorHandler(error, 500));
  }
};
const upload_avatar = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return next(errorHandler("User not found", 404));
  
      if (user.avatar) {
        return next(errorHandler("You already added an avatar before", 400));
      }
  
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
      const filePath = path.join(uploadDir, fileName);
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
module.exports = { signup, signin,upload_avatar };
