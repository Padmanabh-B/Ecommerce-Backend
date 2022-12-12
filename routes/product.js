const express = require("express");
const router = express.Router();

const { addProduct, getAllProducts, adimGetAllProducts, getOneProduct, adimUpdateOneProduct, adimDeleteOneProduct, addReview, deleteReview, getOnlyReviewForOneProduct } = require("../controller/productController");
const { isLoggedIn, customRoles } = require("../middlewares/user");


//user routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn, addReview);
router.route("/review").delete(isLoggedIn, deleteReview);
router.route("/reviews").get(isLoggedIn, getOnlyReviewForOneProduct);


//admin routes
router.route("/admin/product/add").post(isLoggedIn, customRoles("admin"), addProduct);
router.route("/admin/products").get(isLoggedIn, customRoles("admin"), adimGetAllProducts);
router.route("/admin/product/:id")
    .put(isLoggedIn, customRoles("admin"), adimUpdateOneProduct)
    .delete(isLoggedIn, customRoles("admin"), adimDeleteOneProduct);


module.exports = router;