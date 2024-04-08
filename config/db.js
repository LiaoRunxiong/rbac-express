const mysql = require("mysql2/promise");
var createError = require("http-errors");

const conf = {
  connectionLimit : 10,
  host: "localhost",
  database: "demo",
  user: "root",
  password: "958570363",
  port: "3306",
};
const pool = mysql.createPool(conf);

module.exports = {
  db: async (sql, sqlParams = false) => {
    try {
      console.log("sql:16", sql);
      let con = await pool.getConnection();
      let data = await con.query(sql, sqlParams);
      //释放链接
      con.release();
      return data;
    } catch (e) {
      console.log("db:", 19, e.message);
      throw createError(500, "服务器错误", { data: null });
    }
  },
  pool,
};
