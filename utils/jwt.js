const jwt = require("jsonwebtoken");
const { jwtSecret: secretKey } = require("../config/config.default");
const defaultOptions = {
  //秒
  expiresIn: 24 * 60 * 60,
  //  algorithm: 默认：HS256
};
module.exports = {
  sign: (payload, options) => {
    return jwt.sign(payload, secretKey, { ...defaultOptions, ...options });
  },
  verify: async (token) => {
    let decoded = await jwt.verify(token, secretKey);
    return decoded;
  },
};
