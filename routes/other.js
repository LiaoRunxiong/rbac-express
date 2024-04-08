var express = require("express");
const otherController = require("../controller/other");
const router = express.Router();

// 刷新 Token 接口
router.post("/refreshToken", otherController.refreshToken);
router.get("/captcha", otherController.captcha);

module.exports = router;
