var express = require("express");
const userController = require("../controller/user");
const router = express.Router();
const { auth } = require("../middleware/auth");

/* GET users listing. */

router.post("/list", auth, userController.list);

router.get("/selfMsg", auth, userController.selfMsg);

module.exports = router;
