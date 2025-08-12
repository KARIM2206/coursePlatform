const router = require("express").Router();
const { addToCart, getCart, deleteCart, deleteCartItem } = require("../controllers/cart.controller");
const isAuth = require("../middleware/auth");

router.post("/add", isAuth, addToCart);
router.get("/get", isAuth, getCart);
router.delete("/delete", isAuth, deleteCart);
router.delete("/deleteCourse/:courseId", isAuth, deleteCartItem);
// router.put("/update/:courseId", isAuth, updateCart);

module.exports = router;