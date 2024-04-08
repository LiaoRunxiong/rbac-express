var express = require("express");
const userController = require("../controller/user");
const authController = require("../controller/auth");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/callback", authController.callback);
module.exports = router;
