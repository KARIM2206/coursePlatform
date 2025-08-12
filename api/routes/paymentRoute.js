const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/auth");
const { stripeWebhook, getCheckoutSession } = require("../controllers/payment.controller");



router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // مهم علشان Stripe يقدر يقرأ البيانات
  stripeWebhook
);
router.post('/create-checkout-session/:courseId',isAuth,getCheckoutSession)
router.post('/create-checkout-session', isAuth, getCheckoutSession);
module.exports = router;