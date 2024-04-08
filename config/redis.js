const redis = require("redis");
var createError = require("http-errors");

const client = redis
  .createClient({
    host: "localhost",
    port: 6379,
    password: "",
  })
  .on("error", (err) => {
    console.log("Redis Client Error", err);
    throw err;
  })
  .on("connect", () => console.log("Redis Client connect"));
// // 在连接建立后打印成功信息
// client.on("connect", function () {
//   console.log("Connected to Redis");
// });

// // 在连接关闭后打印关闭信息
// client.on("end", function () {
//   console.log("Redis connection closed");
// });

// // 错误处理
// client.on("error", function (err) {
//   console.error("Redis error:", err);
// });
module.exports = {
  redis: client,
  // setx: async (key, value, expireSeconds) => {
  //   await client.setex(key, value, expireSeconds);
  // },
};
