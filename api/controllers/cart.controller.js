const Cart = require("../models/cartModel");
const errorHandler = require("../utils/error");
const Course= require("../models/coursesModel");
const { Types } = require('mongoose');

const addToCart = async (req, res, next) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId) return next(errorHandler('Course id is required', 400));

    const courseObjectId = new Types.ObjectId(courseId);

    let cart = await Cart.findOne({ userId });
    const course=await Course.findById(courseObjectId);
if(course.subscribers.includes(userId)) {
      return next(errorHandler('You have already subscribed to this course', 400));
    }
    if (cart) {
      const courseExist = cart.courses.some(item =>
        item.courseId.equals(courseObjectId)
      );

      if (courseExist) {
        return next(errorHandler('Course already exists in cart', 400));
      }

      cart.courses.push({ courseId: courseObjectId });
      await cart.save();
    } else {
      await Cart.create({
        userId,
        courses: [{ courseId: courseObjectId }]
      });
    }

    const updatedCart = await Cart.findOne({ userId }).populate('courses.courseId');

    res.status(200).json({
      ok: true,
      message: 'Course added to cart',
      cart: updatedCart
    });

  } catch (error) {
    return next(errorHandler(error, 500));
  }
};

// const updateCart = async (req, res, next) => {
//     const userId = req.user.id
//     const {courseId} = req.query
//     const {quantity} = req.body
//     try {
//         const cart = await Cart.findOne({userId: userId})
//         if(!cart) return next(errorHandler('Cart not found', 404));
//       const course =  cart.courses.filter(item => item.courseId == courseId)
//        course.quantity = quantity
//         await cart.save()
//         res.status(200).json({ok: true, message: 'Course added to cart', cart})
//     } catch (error) {
//         return next(errorHandler(error, 500))
//     }
// }
const getCart = async (req, res, next) => {
    const userId = req.user.id
    try {
        const cart = await Cart.findOne({userId: userId})
        if(!cart) return next(errorHandler('Cart not found', 404));
        res.status(200).json({ok: true, cart})
    } catch (error) {
        return next(errorHandler(error, 500))
    }
}
const deleteCart = async (req, res, next) => {
    const userId = req.user.id
    try {
        const cart = await Cart.findOneAndDelete({userId: userId})
        if(!cart) return next(errorHandler('Cart not found', 404));
        res.status(200).json({ok: true, message: 'Cart deleted successfully'})
    } catch (error) {
        return next(errorHandler(error, 500))
    }

}
const deleteCartItem = async (req, res, next) => {
    const userId = req.user.id
    const {courseId} = req.params
    if (!courseId) return next(errorHandler('Course id is required', 400));
    try {
        const cart = await Cart.findOne({userId: userId})
        const course = await Course.findById(courseId);
        if(course.subscribers.includes(userId)) {
          
        }
        if(!cart) return next(errorHandler('Cart not found', 404));
        const courseObjectId = new Types.ObjectId(courseId);
         cart.courses = cart.courses.filter(course => !course.courseId.equals(courseObjectId));
        await cart.save()
        res.status(200).json({ok: true, cart})
    } catch (error) {
        return next(errorHandler(error, 500))
    }
}
module.exports = {addToCart,getCart,deleteCart,deleteCartItem}