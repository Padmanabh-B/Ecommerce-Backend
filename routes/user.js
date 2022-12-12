const express = require("express");
const router = express.Router();

const { signup, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUsers, managerAllUsers, adminOneUser, adminUpdateOneUserDetails, adminDeleteOneUserDetails } = require("../controller/userController");
const { isLoggedIn, customRoles } = require("../middlewares/user");


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userDashboard/update").post(isLoggedIn, updateUserDetails);

//admin routes -> is only for admin
router.route("/admin/users").get(isLoggedIn, customRoles('admin'), adminAllUsers);
router.route("/admin/users/:id").get(isLoggedIn, customRoles('admin'), adminOneUser).put(isLoggedIn, customRoles("admin"), adminUpdateOneUserDetails).delete(isLoggedIn, customRoles("admin"), adminDeleteOneUserDetails)         

//manager routes-> only he get users not admin not other manager
router.route("/manager/users").get(isLoggedIn, customRoles('manager'), managerAllUsers);


module.exports = router;