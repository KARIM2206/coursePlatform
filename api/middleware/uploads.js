const multer = require('multer');

// ✅ General Memory Storage
const memoryStorage = multer.memoryStorage();

// ✅ File filter to allow only video/image in specific fields
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed in "video" field'), false);
    }
  } else if (file.fieldname === 'poster') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed in "poster" field'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

// ✅ Upload Middleware for Video Uploads (with file size limit!)
const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

// ✅ This is the middleware you use in the route
const uploadMiddleware = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'poster', maxCount: 1 },
]);

// ✅ Other upload middlewares (avatars)
const uploadUserAvatar = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
const uploadCourseAvatar = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
const uploadPlaylistAvatar = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = {
  uploadMiddleware,
  uploadCourseAvatar,
  uploadPlaylistAvatar,
  uploadUserAvatar,
};
