const userModel = require("../model/user");
var createError = require("http-errors");
const { v4: uuidv4 } = require("uuid"); // Import the uuid package
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("../utils/jwt");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { username, phone, password } = req.body;
      // Validate phone number format
      const phoneRegex = /^\d{11}$/;
      if (!username) {
        throw createError(400, "用户名不能为空");
      }
      if (!phoneRegex.test(phone)) {
        throw createError(400, "手机号格式不正确");
      }
      if (!password || password.length < 6) {
        throw createError(400, "密码长度为6");
      }
      const record = await userModel.list({ phone });
      if (record.length > 0) {
        throw createError(400, "手机号已被注册");
      }
      const user_id = uuidv4(); // Generate a UUID for the user
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      await userModel.register({ ...req.body, user_id });
      res.status(200).send({
        code: 200,
        msg: "注册成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { phone, password, captcha } = req.body;
      if (!phone) {
        throw createError(400, "手机号不能为空", { data: null });
      }
      if (!password) {
        throw createError(400, "密码不能为空", { data: null });
      }
      if (!captcha) {
        throw createError(400, "请输入验证码", { data: null });
      }
      console.log(66, req.session.captcha, req.sessionID);

      const record = await userModel.list({ phone });
      if (record.length === 0) {
        throw createError(401, "手机号或密码错误", { data: null });
      }
      let user = record[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw createError(401, "手机号或密码错误", { data: null });
      }
      // 签发 Token
      const token = jwt.sign(
        { user_id: user.user_id },
        {
          expiresIn: "60m",
        }
      );
      const refreshToken = jwt.sign(
        { user_id: user.user_id },
        {
          expiresIn: "7d",
        }
      );
      res.status(200).send({
        code: 200,
        msg: "登录成功",
        data: { result: user, token, refreshToken },
      });
    } catch (error) {
      next(error);
    }
  },
  callback: async (req, res, next) => {
    try {
      console.log(39, res);
      if (req.query.code) {
        let res2 = await axios.post(
          "https://github.com/login/oauth/access_token",
          {
            client_id: "f1a8ecbdabd1a663c7c8",
            client_secret: "3c86850219f63a1e14f95132b2d51191eca5a93f",
            code: req.query.code,
          },
          {
            headers: { Accept: "application/json" },
          }
        );
        let token = res2.data.access_token;
        let userRes = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let user = userRes.data;
        const record = await userModel.list({ user_id: user.id });
        if (record.length > 0) {
          console.log(57, record);
          res.redirect(301, "http://localhost:9000" + `?token=${token}`);
        } else {
          await userModel.register({
            username: user.login,
            user_id: user.id,
            avatar_url: user.avatar_url,
            login_type: "github",
            password: "123456",
          });
          res.redirect(301, "http://localhost:9000" + `?token=${token}`);

          res.status(200).send({
            code: 200,
            msg: "注册成功",
            data: null,
          });
        }
      }
    } catch (error) {
      console.log("auth:callback:70", error);
      next(createError(500, "服务器错误", { data: null }));
    }
  },
};
