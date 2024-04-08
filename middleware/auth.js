const jwt = require("../utils/jwt");
var createError = require("http-errors");

module.exports = {
  // 中间件，验证 Token
  auth: async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      next(createError(401, "token验证失败"));
    }
    try {
      let decoded = await jwt.verify(token);
      console.log(20, decoded);
      req.user_id = decoded.user_id;
      next();
    } catch (error) {
      next(createError(403, "token验证失败"));
    }
  },
};
