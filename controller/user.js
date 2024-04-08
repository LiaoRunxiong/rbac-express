const userModel = require("../model/user");
var createError = require("http-errors");
module.exports = {
  list: async (req, res, next) => {
    try {
      const data = await userModel.list(req.body);
      console.log(5, data);
      res.status(200).send({
        code: 200,
        msg: "获取信息成功",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  selfMsg: async (req, res, next) => {
    try {
      const data = await userModel.selfMsg(req.user_id);
      res.status(200).send({
        code: 200,
        msg: "获取成功",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
