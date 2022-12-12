const express = require("express");
const { home,homeDummy } = require("../controller/homeController");
const router = express.Router();

router.route("/").get(home);
router.route("/homeDummy").get(homeDummy);

module.exports = router;