var createError = require("http-errors");
const jwt = require("../utils/jwt");
const svgCaptcha = require("svg-captcha");
module.exports = {
  refreshToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      // 验证 Refresh Token

      let decoded = await jwt.verify(refreshToken);
      console.log(24, decoded);
      // 签发新的 Access Token
      const accessToken = jwt.sign(
        { user_id: decoded.user_id },
        {
          expiresIn: "1m",
        }
      );
      res.status(200).send({
        code: 200,
        msg: "成功",
        data: accessToken,
      });
    } catch (error) {
      next(createError(401, "refreshToken无效"));
    }
  },
  captcha: async (req, res, next) => {
    try {
      // 生成图形验证码
      const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 40,
        width: 80,
        height: 40,
        background: "#fff",
        color: true,
      });
      const captchaText = captcha.text.toLowerCase(); // 将验证码转换为小写以便存储和验证

      // // 存储验证码到 Redis，并设置过期时间为 5 分钟
      // await redis.connect();
      // await redis.set("cap", captchaText, {
      //   EX: 60 * 5,
      // });
      // await redis.disconnect();
      req.session.regenerate(function (err) {
        if (err) next(err);

        // store user information in session, typically a user id
        req.session.captcha = captchaText;
        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err);
          // req.session.save()
          console.log(37, captchaText, req.session);
          // 设置响应头
          res.type("svg");
          res.status(200).send({
            code: 200,
            msg: "获取成功",
            data: captcha.data,
          });
        });
      });
    } catch (error) {
      console.log("other:c:53:captcha", error);
      next(createError(500, "服务器错误", { data: null }));
    }
  },
};
