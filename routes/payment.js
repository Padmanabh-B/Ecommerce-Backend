const express = require("express");
const router = express.Router();
const { isLoggedIn, customRoles } = require("../middlewares/user");
const { sendStripeKey, sendRazorPayKey, captureStriptePayment, captureRazorpayPayment } = require("../controller/paymentController")


router.route("/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn, sendRazorPayKey);

router.route("/capturestripe").post(isLoggedIn, captureStriptePayment);
router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);




module.exports = router;