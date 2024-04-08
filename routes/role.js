var express = require("express");
const roleController = require("../controller/role");
const router = express.Router();
const { auth } = require("../middleware/auth");

/* GET users listing. */

router.get("/list", auth, roleController.list);
router.post("/add", auth, roleController.add);
router.post("/edit", auth, roleController.edit);
router.post("/delete", auth, roleController.delete);

module.exports = router;
